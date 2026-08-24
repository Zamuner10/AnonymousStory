package com.viniciuskz.anonymousstories.security;


import com.viniciuskz.anonymousstories.config.SecurityFilter;
import com.viniciuskz.anonymousstories.service.CustomUserDetailsService;
import com.viniciuskz.anonymousstories.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class SecurityIntegrationTest {

    @Mock
    private TokenService tokenService;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private SecurityFilter securityFilter;

    @BeforeEach
    void setUp(){
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Should not authenticate user when Authorization header is missing")
    void doFilterInternal_WhitoutToken_ShouldNotAuthentication() throws ServletException, IOException {

        //ARRANGE: Requisição sem o header Authorization
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        //ACT
        securityFilter.doFilter(request, response, filterChain);

        //ASSERT: O contexto de segurança continua nulo e a requisição segue no fluxo
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain).doFilter(request, response);
    }
}
