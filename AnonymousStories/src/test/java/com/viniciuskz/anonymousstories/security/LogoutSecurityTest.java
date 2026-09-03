package com.viniciuskz.anonymousstories.security;

import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import com.viniciuskz.anonymousstories.service.TokenService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// ATENÇÃO: este teste usa @SpringBootTest de propósito (diferente do
// LoginControllerTest, que usa standaloneSetup) — precisamos do Spring
// Security de verdade rodando pra testar se /logout realmente exige
// autenticação. Segue o mesmo padrão dos outros testes de segurança do
// projeto (JwtSecurityTest, SecurityIntegrationTest).
//
// IMPORTANTE: copie aqui embaixo, no lugar de
// "properties = { /* ... */ }", o MESMO bloco de properties (banco H2 em
// memória, JWT_SECRET de teste etc.) que já está em
// AnonymousstoriesApplicationTests.java — não reconstruí esse bloco do
// zero pra não arriscar um valor diferente do que já funciona no seu
// projeto e causar mais um erro de configuração.
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
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class LogoutSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    private String validToken;

    @BeforeEach
    void setUp() {
        // Cria um usuário real e já verificado direto no banco de teste
        // (H2 em memória), pra gerar um token JWT válido sem precisar
        // passar pelo fluxo completo de cadastro + verificação por e-mail.
        //
        // IMPORTANTE: o e-mail precisa ser único a cada execução deste
        // setUp(). O @SpringBootTest reaproveita o MESMO contexto (e o
        // mesmo banco H2) entre os dois métodos de teste desta classe —
        // criar um contexto novo por teste seria caro demais. Como esse
        // método roda antes de CADA teste (@BeforeEach), usar sempre o
        // mesmo e-mail fixo faria o segundo teste tentar inserir um
        // e-mail que o primeiro já cadastrou, violando a restrição de
        // e-mail único do banco. Um sufixo aleatório (UUID) resolve isso
        // sem precisar limpar o banco manualmente entre os testes.
        String uniqueEmail = "logout-test-" + UUID.randomUUID() + "@email.com";

        User user = new User();
        user.setName("Usuário Teste Logout");
        user.setEmail(uniqueEmail);
        user.setPassword(passwordEncoder.encode("SenhaValida1!"));
        user.setAge(20);
        user.setIsVerified(true);
        userRepository.save(user);

        validToken = tokenService.generateToken(user);
    }

    @Test
    @DisplayName("Should return 401 Unauthorized when attempting to logout without being authenticated")
    void logout_UnauthenticatedUser_Returns401() throws Exception {
        mockMvc.perform(post("/logout"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 200 OK and clear the jwtToken cookie when authenticated user logs out")
    void logout_AuthenticatedUser_Returns200AndClearsCookie() throws Exception {
        Cookie authCookie = new Cookie("jwtToken", validToken);

        mockMvc.perform(post("/logout").cookie(authCookie))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("jwtToken=")))
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("Max-Age=0")));
    }
}