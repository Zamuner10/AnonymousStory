package com.viniciuskz.anonymousstories.controller;

import com.viniciuskz.anonymousstories.dto.LoginRequestDTO;
import com.viniciuskz.anonymousstories.dto.LoginResponseDTO;
import com.viniciuskz.anonymousstories.service.LoginService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping
public class LoginController {

    private final LoginService loginService;

    @Value("${app.cookie.secure:false}")
    private boolean isSecureCookie;

    // NOVO: sameSite agora vem de variável de ambiente, com "Lax" como
    // padrão seguro para desenvolvimento local. Antes estava fixo em
    // "None" no código — e "None" só funciona se o cookie também for
    // Secure, que por sua vez só funciona em conexão HTTPS. Rodando
    // local em http://localhost, isso fazia o navegador descartar o
    // cookie silenciosamente: o login retornava 200, mas a sessão nunca
    // "colava" de verdade.
    //
    // Em produção (Render + front em outro domínio), configure
    // APP_COOKIE_SAMESITE=None nas variáveis de ambiente do Render,
    // junto com APP_COOKIE_SECURE=true (esse já deve estar configurado).
    // Localmente, não precisa configurar nada — o padrão "Lax" já
    // funciona certo com APP_COOKIE_SECURE=false.
    @Value("${app.cookie.samesite:Lax}")
    private String cookieSameSite;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto, HttpServletResponse response) {
        String token = loginService.login(dto);

        ResponseCookie cookie = ResponseCookie.from("jwtToken", token)
                .httpOnly(true)
                .secure(isSecureCookie)
                .maxAge(Duration.ofHours(2))
                .sameSite(cookieSameSite)
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new LoginResponseDTO("Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response){
        // IMPORTANTE: o cookie de logout precisa ter EXATAMENTE os mesmos
        // atributos (secure, sameSite, path) do cookie de login, senão o
        // navegador entende como um cookie diferente e não apaga o de
        // verdade.
        ResponseCookie cookie = ResponseCookie.from("jwtToken", "")
                .httpOnly(true)
                .secure(isSecureCookie)
                .path("/")
                .maxAge(0)
                .sameSite(cookieSameSite)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }
}