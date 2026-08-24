package com.viniciuskz.anonymousstories.service;


import com.viniciuskz.anonymousstories.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp(){
        tokenService = new TokenService();

        ReflectionTestUtils.setField(tokenService, "secret", "my-secret-key-for-testing-1234567890");
    }

    @Test
    @DisplayName("Should generate token successfully for valid user")
    void generateToken_Sucess(){

        User user = new User();
        user.setEmail("test@email.com");

        String token = tokenService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    @DisplayName("Should validate token and return subject (email) successfully")
    void validateToken_Sucess(){

        User user = new User();
        user.setEmail("test@email.com");

        String token = tokenService.generateToken(user);
        String subject = tokenService.validateToken(token);

        assertEquals("test@email.com", subject);
    }

    @Test
    @DisplayName("Should return empty string or null when token is invalid")
        void validateToken_InvalidToken_ReturnsEmpty() {

        //ARRANGE
            String invalidToken = "invalid.jwt.token";

            //ACT
            String subject = tokenService.validateToken(invalidToken);

            //ASSERT
            assertTrue(subject == null || subject.isEmpty());
        }

}
