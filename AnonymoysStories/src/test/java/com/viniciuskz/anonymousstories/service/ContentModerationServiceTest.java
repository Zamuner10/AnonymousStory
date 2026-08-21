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
        RestClient.Builder builder = RestClient.builder();
        this.mockServer = MockRestServiceServer.bindTo(builder).build();
        this.moderationService.setRestClient(builder.build());
    }

    @Test
    @DisplayName("Should approve safe content")
    void validateText_Approved() {
        String mockResponse = "{\"results\":[{\"flagged\":false}]}";

        this.mockServer.expect(requestTo("https://api.openai.com/v1/moderations"))
                .andRespond(withSuccess().body(mockResponse).contentType(MediaType.APPLICATION_JSON));

        assertDoesNotThrow(() -> this.moderationService.validateText("A report on a normal and productive day."));
    }

    @Test
    @DisplayName("Should reject content flagged as a violation by the API")
    void validateText_RejectedByApi() {
        String mockResponse = "{\"results\":[{\"flagged\":true}]}";

        this.mockServer.expect(requestTo("https://api.openai.com/v1/moderations"))
                .andRespond(withSuccess().body(mockResponse).contentType(MediaType.APPLICATION_JSON));

        assertThrows(ContentModerationException.class, () ->
                this.moderationService.validateText("Text with prohibited speech"));
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
        this.mockServer.expect(requestTo("https://api.openai.com/v1/moderations"))
                .andRespond(withServerError());

        assertThrows(ModerationServiceException.class, () ->
                this.moderationService.validateText("Any text for analysis"));
    }
}