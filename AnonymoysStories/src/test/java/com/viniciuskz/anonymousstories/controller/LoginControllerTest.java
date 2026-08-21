package com.viniciuskz.anonymousstories.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciuskz.anonymousstories.dto.LoginRequestDTO;
import com.viniciuskz.anonymousstories.dto.LoginResponseDTO;
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
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

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
    @DisplayName("Should return 200 OK and token on successful login")
    void login_Sucess() throws Exception {

        //ARRANGE
        LoginRequestDTO request = new LoginRequestDTO("user@email.com", "123456");
        LoginResponseDTO response = new LoginResponseDTO(1L, "Test user", "user@email.com", "mocked-jwt-token");

        Mockito.when(this.loginService.login(ArgumentMatchers.any(LoginRequestDTO.class)))
                        .thenReturn(response);

        this.mockMvc.perform(MockMvcRequestBuilders.post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").value("mocked-jwt-token"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("user@email.com"));
    }

    @Test
    @DisplayName("Should return 401 Unauthorized when credentials (password) are invalid")
    void login_InvalidCredentials_ReturnsUnauthorized() throws Exception {
        LoginRequestDTO request = new LoginRequestDTO("user@email.com", "wrongpassword");

        Mockito.when(this.loginService.login(ArgumentMatchers.any(LoginRequestDTO.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        this.mockMvc.perform(MockMvcRequestBuilders.post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }


    @Test
    @DisplayName("Should return 403 Forbidden when user is not verified")
    void login_UserNotVerified_ReturnsForBidden() throws Exception{
        LoginRequestDTO request =  new LoginRequestDTO("unverified@email.com", "123456");
        Mockito.when(this.loginService.login(ArgumentMatchers.any(LoginRequestDTO.class)))
                .thenThrow(new UserNotVerifiedException("User email not verified"));

        this.mockMvc.perform(MockMvcRequestBuilders.post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }
}
