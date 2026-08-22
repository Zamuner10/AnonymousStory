package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import com.viniciuskz.anonymousstories.exception.ModerationServiceException;
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
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest
public class ContentModerationServiceTest {

    @Autowired
    private ContentModerationService moderationService;

    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        // Instancia o builder e o mockServer sem depender do Autowired
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();

        // Injeta o RestClient mockado no serviço
        moderationService.setRestClient(builder.build());
    }

    @Test
    @DisplayName("Should approve safe content")
    void validateText_Approved() {
        String cleanText = "A report on a normal and productive day.";

        mockServer.expect(requestTo(containsString("purgomalum.com")))
                .andRespond(withSuccess("false", MediaType.TEXT_PLAIN));

        assertDoesNotThrow(() -> moderationService.validateText(cleanText));
        mockServer.verify();
    }

    @Test
    @DisplayName("Should reject content flagged as a violation by the API")
    void validateText_RejectedByApi() {
        String badText = "Text with prohibited speech";

        mockServer.expect(requestTo(containsString("purgomalum.com")))
                .andRespond(withSuccess("true", MediaType.TEXT_PLAIN));

        assertThrows(ContentModerationException.class,
                () -> moderationService.validateText(badText));
        mockServer.verify();
    }

    @Test
    @DisplayName("Should reject content containing personal identifiable information (PII)")
    void validateText_RejectedByPii() {
        assertThrows(ContentModerationException.class, () ->
                this.moderationService.validateText("My CPF number is 123.456.789-00"));
    }

    @Test
    @DisplayName("Should throw ModerationServiceException when the external API is unavailable")
    void validateText_ApiUnavailable() {
            mockServer.expect(requestTo(containsString("purgomalum.com")))
                    .andRespond(withServerError()); // Simula resposta 500

            assertThrows(ModerationServiceException.class, () ->
                    this.moderationService.validateText("Any text for analysis"));

            mockServer.verify();
        }
}