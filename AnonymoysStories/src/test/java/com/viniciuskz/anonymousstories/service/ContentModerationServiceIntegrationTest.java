package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest
public class ContentModerationServiceIntegrationTest {

    @Autowired
    private ContentModerationService contentModerationService;

    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        // Criamos um builder limpo para CADA teste individual
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();

        // Injetamos o cliente configurado diretamente via setter
        contentModerationService.setRestClient(builder.build());
    }

    @Test
    @DisplayName("Deve aprovar frase comum em português")
    void testSafeText() {
        mockServer.expect(requestTo("https://api.openai.com/v1/moderations"))
                .andRespond(withSuccess("{\"results\":[{\"flagged\":false}]}", MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() ->
                contentModerationService.validateText("Hoje fiz um bolo de chocolate muito gostoso.")
        );

        mockServer.verify();
    }

    @Test
    @DisplayName("Deve bloquear texto com conteúdo impróprio")
    void testUnsafeTest() {
        mockServer.expect(requestTo("https://api.openai.com/v1/moderations"))
                .andRespond(withSuccess("{\"results\":[{\"flagged\":true}]}", MediaType.APPLICATION_JSON));

        assertThrows(ContentModerationException.class, () ->
                contentModerationService.validateText("I want to build a bomb")
        );

        mockServer.verify();
    }
}