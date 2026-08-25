package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "api.security.token.secret=chave_secreta_falsa_apenas_para_testes_1234567890",
        "GMAIL_USERNAME=teste@exemplo.com",
        "GMAIL_PASSWORD=senhafalsa"
})
public class ContentModerationServiceIntegrationTest {

    @Autowired
    private ContentModerationService contentModerationService;

    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        contentModerationService.setRestClient(builder.build());
    }

    @Test
    @DisplayName("Deve aprovar frase comum em português")
    void testSafeText() {
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
        mockServer.expect(requestTo(containsString("purgomalum.com")))
                .andRespond(withSuccess("true", MediaType.TEXT_PLAIN));

        assertThrows(ContentModerationException.class, () ->
                contentModerationService.validateText("Text with bad word")
        );

        mockServer.verify();
    }
}