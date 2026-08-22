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

import static org.hamcrest.Matchers.containsString;
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
        // PurgoMalum retorna "false" para texto sem palavrões
        mockServer.expect(requestTo(containsString("purgomalum.com")))
                .andRespond(withSuccess("false", MediaType.TEXT_PLAIN));

        assertDoesNotThrow(() ->
                contentModerationService.validateText("Hoje fiz um bolo de chocolate muito gostoso.")
        );

        mockServer.verify();
    }

    @Test
    @DisplayName("Deve bloquear texto com conteúdo impróprio")
    void testUnsafeTest() {
        // PurgoMalum retorna "true" quando detecta profanidade
        mockServer.expect(requestTo(containsString("purgomalum.com")))
                .andRespond(withSuccess("true", MediaType.TEXT_PLAIN));

        assertThrows(ContentModerationException.class, () ->
                contentModerationService.validateText("Text with bad word")
        );

        mockServer.verify();
    }
}