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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// NOTA: os testes de /logout que checavam "exige autenticação" (401 sem
// login, 200 com login) foram REMOVIDOS daqui. O motivo: este teste usa
// MockMvcBuilders.standaloneSetup(), que testa o LoginController isolado,
// SEM carregar o Spring Security de verdade. Sem o filtro de segurança
// real rodando, @WithMockUser não faz nada, e o logout() sempre retorna
// 200 — o teste "sem autenticação retorna 401" nunca vai passar aqui,
// porque não existe ninguém checando autenticação neste tipo de teste.
//
// Os testes de logout que precisam checar autenticação de verdade devem
// ficar junto dos outros testes de segurança do projeto (o arquivo que já
// usa @SpringBootTest + @AutoConfigureMockMvc, carregando o filtro
// completo) — veja LogoutSecurityTest.java, criado ao lado deste.
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
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.message").value("Login successful"));
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
}