package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import com.viniciuskz.anonymousstories.exception.ModerationServiceException;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.regex.Pattern;

@Service
public class ContentModerationService {

    private RestClient restClient;

    private static final String PURGOMALUM_URL = "https://www.purgomalum.com/service/containsprofanity";

    // Padrões Regex existentes (PII e Spam)
    private static final Pattern CPF_PATTERN = Pattern.compile("\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\b\\(?\\d{2}\\)?\\s?)(\\d{4,5}-?\\d{4}\\b)");
    private static final Pattern URL_SPAM_PATTERN = Pattern.compile("(https?://\\S+|www\\.\\S+)");

    // Detecção de número de Cartão de Crédito (13 a 16 dígitos numéricos)
    private static final Pattern CREDIT_CARD_PATTERN = Pattern.compile("\\b(?:\\d[ -]*?){13,16}\\b");

    public ContentModerationService() {
        // Timeout de 3 segundos para não prender o usuário se a API externa estiver lenta
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) Duration.ofSeconds(3).toMillis());
        requestFactory.setReadTimeout((int) Duration.ofSeconds(3).toMillis());

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    public void setRestClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public void validateText(String text) {
        if (text == null || text.trim().isEmpty()){
            return;
        }

        // 1. Validações locais rigorosas (CPF, Cartão, E-mail, Telefone, Spam)
        checkPIIAndSpam(text);

        // 2. Validação via API Externa (com proteção contra queda/timeout)
        try {
            String response = restClient.get()
                    .uri(PURGOMALUM_URL + "?text={text}", text)
                    .retrieve()
                    .body(String.class);

            String cleanResponse = (response != null) ? response.trim().toLowerCase() : "";

            if ("true".equals(cleanResponse)) {
                throw new ContentModerationException("The submitted content violates the terms of use and community guidelines.");
            }

        } catch (ContentModerationException e) {
            // Se foi bloqueado por palavrão ou PII, repassa a exceção de moderação
            throw e;
        } catch (Exception e) {
            // Se a API externa cair, der timeout ou falhar, APENAS LOGA O ERRO no terminal
            // e NÃO trava o salvamento da carta do usuário!
            System.err.println("Aviso: Falha ao consultar serviço externo PurgoMalum: " + e.getMessage());
        }
    }
    private void checkPIIAndSpam(String text) {
        if (CPF_PATTERN.matcher(text).find() || EMAIL_PATTERN.matcher(text).find() || PHONE_PATTERN.matcher(text).find()) {
            throw new ContentModerationException("Content contains private personal information (CPF, email, or phone number).");
        }

        if (CREDIT_CARD_PATTERN.matcher(text).find()) {
            throw new ContentModerationException("Content contains potentially sensitive financial information (Credit Card).");
        }

        long urlCount = URL_SPAM_PATTERN.matcher(text).results().count();
        if (urlCount > 2) {
            throw new ContentModerationException("Content flagged as spam due to excessive external links.");
        }
    }
}