package com.viniciuskz.anonymousstories.security;

import com.viniciuskz.anonymousstories.config.SecurityFilter;
import com.viniciuskz.anonymousstories.controller.StoryController;
import com.viniciuskz.anonymousstories.exception.GlobalExceptionHandler;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class JwtSecurityTest {
    private MockMvc mockMvc;

    @Mock
    private SecurityFilter securityFilter;

    @InjectMocks
    private StoryController storyController;

    @BeforeEach
    void setUp() throws Exception {
        Mockito.doAnswer(invocation -> {
            HttpServletResponse response = invocation.getArgument(1);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }).when(this.securityFilter).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class), any(FilterChain.class));
        this.mockMvc = MockMvcBuilders.standaloneSetup(this.storyController)
                .addFilters(this.securityFilter)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("It should return a 401 error when accessing a protected route without authentication.")
    void protectedRoute_WithouAuth_ReturnsUnauThorized() throws  Exception{
        this.mockMvc.perform(get("/api/stories"))
                .andExpect(status().isUnauthorized());
    }
    @Test
    @DisplayName("It should return a 401 error when sending an invalid or malformatted JWT.")
    void protectedRoute_InvalidJwt_ReturnsUnauthorized() throws  Exception {
        this.mockMvc.perform(get("/api/stories")
                .header("Authorization", "Bearer token_completely_invalid"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("It should return a 401 error when sending a tampered JWT.")
    void protectRoute_TamperedJwt_ReturnUnauthorized() throws Exception{
        String tamperedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.tampered_signature";

        this.mockMvc.perform(get("/api/stories")
                        .header("Authorization", "Bearer " + tamperedToken))
                        .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("It should return a 401 error when sending a timed JWT")
    void protectRoute_ExpiredJwt_ReturnsUnauthorized() throws Exception{
        String expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSIsImV4cCI6MTAwMDAwMDBBfQ.signature";
        this.mockMvc.perform(get("/api/stories")
                .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }
}
