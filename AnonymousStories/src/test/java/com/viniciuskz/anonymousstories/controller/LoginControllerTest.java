package com.viniciuskz.anonymousstories.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciuskz.anonymousstories.dto.LoginRequestDTO;
import com.viniciuskz.anonymousstories.exception.GlobalExceptionHandler;
import com.viniciuskz.anonymousstories.exception.UserNotVerifiedException;
import com.viniciuskz.anonymousstories.service.LoginService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class LoginControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private LoginService loginService;

    @InjectMocks
    private LoginController loginController;

    @BeforeEach
    void setUp(){
        mockMvc = MockMvcBuilders.standaloneSetup(loginController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("Should return 200 OK, Set-Cookie header and success message on valid login")
    void login_Sucess() throws Exception {

        // ARRANGE
        LoginRequestDTO request = new LoginRequestDTO("user@email.com", "123456");

        // O loginService agora retorna a String do token
        Mockito.when(this.loginService.login(ArgumentMatchers.any(LoginRequestDTO.class)))
                .thenReturn("mocked-jwt-token");

        // ACT & ASSERT
        this.mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("jwtToken=mocked-jwt-token")))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("HttpOnly")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Login successful"));
    }

    @Test
    @DisplayName("Should return 401 Unauthorized when credentials (password) are invalid")
    void login_InvalidCredentials_ReturnsUnauthorized() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("user@email.com", "wrongpassword");

        Mockito.when(this.loginService.login(ArgumentMatchers.any(LoginRequestDTO.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        this.mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 403 Forbidden when user is not verified")
    void login_UserNotVerified_ReturnsForBidden() throws Exception{
        LoginRequestDTO request = new LoginRequestDTO("unverified@email.com", "123456");
        Mockito.when(this.loginService.login(ArgumentMatchers.any(LoginRequestDTO.class)))
                .thenThrow(new UserNotVerifiedException("User email not verified"));

        this.mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should successfully logout authenticated user by clearing the jwtToken cookie")
    @WithMockUser(username = "auth@email.com")
    void logout_AuthenticateUser_ShouldReturn200AndClearCookie() throws Exception{
        mockMvc.perform(post("/logout"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("jwtToken=;")))
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("Max-Age=0")));
    }

    @Test
    @DisplayName("It should return a 401 Unauthorized error when attempting to log out without being authenticated.")
    void logout_UnauthenticatedUser_Return401Unauthorized() throws Exception {
        mockMvc.perform(post("/logout"))
                .andExpect(status().isUnauthorized());
    }
}