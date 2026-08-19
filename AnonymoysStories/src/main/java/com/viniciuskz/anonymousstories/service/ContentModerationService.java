package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.ModerationRequest;
import com.viniciuskz.anonymousstories.dto.ModerationResponse;
import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ContentModerationService {

    private RestClient restClient;

    @Value("${openai.api.url:https://api.openai.com/v1/moderations}")
    private String openAiUrl;

    @Value("${openai.api.key}")
    private String apiKey;

    public ContentModerationService() {
        this.restClient = RestClient.create();
    }

    // Permite injetar o RestClient configurado nos testes
    public void setRestClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public void validateText(String text) {
        ModerationResponse response = restClient.post()
                .uri(openAiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ModerationRequest(text))
                .retrieve()
                .body(ModerationResponse.class);

        // Bloco IF corrigido (sem o ponto e vírgula ao final)
        if (response != null && response.results() != null && !response.results().isEmpty()) {
            if (response.results().get(0).flagged()) {
                throw new ContentModerationException("O conteúdo enviado viola os termos de uso e diretrizes da comunidade.");
            }
        }
    }
}