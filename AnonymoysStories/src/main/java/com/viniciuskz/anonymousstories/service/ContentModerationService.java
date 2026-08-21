package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.ModerationRequest;
import com.viniciuskz.anonymousstories.dto.ModerationResponse;
import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import com.viniciuskz.anonymousstories.exception.ModerationServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.util.regex.Pattern;

@Service
public class ContentModerationService {

    private RestClient restClient;

    @Value("${openai.api.url:https://api.openai.com/v1/moderations}")
    private String openAiUrl;

    @Value("${openai.api.key}")
    private String apiKey;

    // Regras de detecção local para PII (Dados Pessoais) e Spam basico
    private static final Pattern CPF_PATTERN = Pattern.compile("\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\b\\(?\\d{2}\\)?\\s?)(\\d{4,5}-?\\d{4}\\b)");
    private static final Pattern URL_SPAM_PATTERN = Pattern.compile("(https?://\\S+|www\\.\\S+)");

    public ContentModerationService() {
        this.restClient = RestClient.create();
    }

    // Permite injetar o RestClient configurado nos testes
    public void setRestClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public void validateText(String text) {
        if (text == null || text.trim().isEmpty()){
            return;
        }

        checkPIIAndSpam(text);

        try {
            ModerationResponse response = restClient.post()
                    .uri(openAiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ModerationRequest(text))
                    .retrieve()
                    .body(ModerationResponse.class);

            if (response == null || response.results() == null || response.results().isEmpty()) {
                throw new ModerationServiceException("The moderation API returned an invalid or empty response.");
            }

            if (response.results().get(0).flagged()) {
                // Lança ContentModerationException para violação de regras da comunidade
                throw new ContentModerationException("The submitted content violates the terms of use and community guidelines.");
            }

        } catch (ResourceAccessException e) {
            throw new ModerationServiceException("The moderation service is temporarily unavailable (Timeout/Network). The post has been blocked.", e);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new ModerationServiceException("Internal authentication error with the moderation service.", e);
            } else if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new ModerationServiceException("Moderation request limit exceeded. Please try again in a few moments.", e);
            }
            throw new ModerationServiceException("Error in the request for the moderation service: " + e.getStatusCode(), e);
        } catch (HttpServerErrorException e) {
            throw new ModerationServiceException("The content moderation server experienced instability (" + e.getStatusCode() + ").", e);
        } catch (Exception e) {
            if (e instanceof ContentModerationException || e instanceof ModerationServiceException) {
                throw e;
            }
            throw new ModerationServiceException("Content moderation failed.", e);
        }
    }

    private void checkPIIAndSpam(String text) {
        if (CPF_PATTERN.matcher(text).find() || EMAIL_PATTERN.matcher(text).find() || PHONE_PATTERN.matcher(text).find()) {
            throw new ContentModerationException("Content contains private personal information (CPF, email, or phone number).");
        }

        // Bloqueio de spam por excesso de links
        long urlCount = URL_SPAM_PATTERN.matcher(text).results().count();
        if (urlCount > 2) {
            throw new ContentModerationException("Content flagged as spam due to excessive external links.");
        }
    }
}