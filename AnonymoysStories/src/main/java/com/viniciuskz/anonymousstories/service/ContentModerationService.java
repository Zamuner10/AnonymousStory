package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import com.viniciuskz.anonymousstories.exception.ModerationServiceException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.regex.Pattern;

@Service
public class ContentModerationService {

    private RestClient restClient;

    private static final String PURGOMALUM_URL = "https://www.purgomalum.com/service/containsprofanity";

    // Regras de detecção local para PII (Dados Pessoais) e Spam básico
    private static final Pattern CPF_PATTERN = Pattern.compile("\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\b\\(?\\d{2}\\)?\\s?)(\\d{4,5}-?\\d{4}\\b)");
    private static final Pattern URL_SPAM_PATTERN = Pattern.compile("(https?://\\S+|www\\.\\S+)");

    public ContentModerationService() {
        this.restClient = RestClient.create();
    }

    public void setRestClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public void validateText(String text) {
        if (text == null || text.trim().isEmpty()){
            return;
        }

        // 1. Executa a verificação local de dados sensíveis e spam
        checkPIIAndSpam(text);

        // 2. Consulta a API da PurgoMalum enviando o texto via Query Parameter
        try {
            String response = restClient.get()
                    .uri(PURGOMALUM_URL + "?text={text}", text)
                    .retrieve()
                    .body(String.class);

            boolean isProfane = Boolean.parseBoolean(response);

            if (isProfane) {
                throw new ContentModerationException("The submitted content violates the terms of use and community guidelines.");
            }

        } catch (ContentModerationException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Erro na chamada da API PurgoMalum: " + e.getMessage());
            // Lança a exceção esperada pelo teste quando a API falhar
            throw new ModerationServiceException("Error contacting external moderation service", e);
        }
    }

    private void checkPIIAndSpam(String text) {
        if (CPF_PATTERN.matcher(text).find() || EMAIL_PATTERN.matcher(text).find() || PHONE_PATTERN.matcher(text).find()) {
            throw new ContentModerationException("Content contains private personal information (CPF, email, or phone number).");
        }

        long urlCount = URL_SPAM_PATTERN.matcher(text).results().count();
        if (urlCount > 2) {
            throw new ContentModerationException("Content flagged as spam due to excessive external links.");
        }
    }
}