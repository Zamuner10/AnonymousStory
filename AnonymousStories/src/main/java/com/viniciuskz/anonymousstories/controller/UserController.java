package com.viniciuskz.anonymousstories.controller;


import com.viniciuskz.anonymousstories.dto.ForgotPasswordRequestDTO;
import com.viniciuskz.anonymousstories.dto.ResetPasswordRequestDTO;
import com.viniciuskz.anonymousstories.dto.UserRequestDTO;
import com.viniciuskz.anonymousstories.dto.UserResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.service.UserService;

import jakarta.validation.Valid;

import java.util.Map;


@RestController
@RequestMapping ("/users")
public class
UserController {


    private final UserService userService;

    // CORRIGIDO: antes o link "Ir para o Login" apontava pra
    // "http://localhost:8080/login" — esse é o endereço do BACKEND, que
    // nem tem essa rota (a tela de login é do React, em outro endereço
    // totalmente diferente). Agora vem de variável de ambiente, igual o
    // resto dos endereços do projeto (DB_URL, JWT_SECRET etc.).
    //
    // Adicione esta linha no application.properties:
    // app.frontend-url=${APP_FRONTEND_URL:http://localhost:5173}
    //
    // E, quando fizer o deploy do front (Vercel/Netlify), configure
    // APP_FRONTEND_URL no painel do Render com a URL real de produção.
    @Value("${app.frontend-url}")
    private String frontendUrl;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO dto) {
        User registeredUser = userService.registerUser(dto);
        UserResponseDTO response = new UserResponseDTO(registeredUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getAuthenticatedUser(@AuthenticationPrincipal User currentUser) {
        UserResponseDTO response = new UserResponseDTO(currentUser);
        return ResponseEntity.ok(response);
    }


    @GetMapping(value = "/verify", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token){
        boolean isVerified = userService.verifyUser(token);
        if (isVerified) {
            String loginPageUrl = frontendUrl + "/login";

            // Redesenhado para seguir o mesmo padrão visual do site
            // (papel #f7f3eb, tinta #1a1208, destaque #b07030, fonte
            // Caveat) — antes era um card branco/azul genérico, sem
            // nenhuma relação visual com "Histórias Anônimas".
            String successHtml = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Conta Ativada - Histórias Anônimas</title>
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet">
                  <style>
                    body {
                      margin: 0;
                      min-height: 100vh;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background-color: #f7f3eb;
                      font-family: 'Caveat', cursive;
                      padding: 16px;
                      box-sizing: border-box;
                    }
                    .card {
                      max-width: 440px;
                      width: 100%%;
                      background: rgba(255,254,248,0.96);
                      border: 2.5px solid #1a1208;
                      border-radius: 10px;
                      padding: 40px 32px;
                      text-align: center;
                      box-shadow: 3px 5px 14px rgba(26,18,8,0.15);
                    }
                    .brand {
                      font-size: 22px;
                      font-weight: 700;
                      color: #1a1208;
                      margin-bottom: 18px;
                    }
                    .brand span { color: #b07030; }
                    .check {
                      width: 56px;
                      height: 56px;
                      margin: 0 auto 16px;
                      border: 2.5px solid #1a1208;
                      border-radius: 50%%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 28px;
                      color: #1a1208;
                    }
                    h1 {
                      font-size: 32px;
                      font-weight: 700;
                      color: #1a1208;
                      margin: 0 0 8px;
                    }
                    p {
                      font-size: 19px;
                      color: #5a4020;
                      line-height: 1.5;
                      margin: 0 0 28px;
                    }
                    a.button {
                      display: inline-block;
                      width: 100%%;
                      box-sizing: border-box;
                      padding: 12px 20px;
                      background-color: #1a1208;
                      color: #f7f3eb;
                      text-decoration: none;
                      border-radius: 4px;
                      font-family: 'Caveat', cursive;
                      font-size: 20px;
                      font-weight: 700;
                    }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="brand">Histórias <span>Anônimas</span></div>
                    <div class="check">✓</div>
                    <h1>Conta ativada com sucesso!</h1>
                    <p>Sua conta foi verificada. Você já pode entrar e começar a ler e escrever histórias, de forma totalmente anônima.</p>
                    <a href="%s" class="button">Ir para o login</a>
                  </div>
                </body>
                </html>
                """.formatted(loginPageUrl);

            return ResponseEntity.ok(successHtml);
        }

        String errorHtml = """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Erro na Ativação - Histórias Anônimas</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet">
              <style>
                body {
                  margin: 0;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #f7f3eb;
                  font-family: 'Caveat', cursive;
                  padding: 16px;
                  box-sizing: border-box;
                }
                .card {
                  max-width: 440px;
                  width: 100%%;
                  background: rgba(255,254,248,0.96);
                  border: 2.5px solid #1a1208;
                  border-radius: 10px;
                  padding: 40px 32px;
                  text-align: center;
                  box-shadow: 3px 5px 14px rgba(26,18,8,0.15);
                }
                .brand {
                  font-size: 22px;
                  font-weight: 700;
                  color: #1a1208;
                  margin-bottom: 18px;
                }
                .brand span { color: #b07030; }
                .cross {
                  width: 56px;
                  height: 56px;
                  margin: 0 auto 16px;
                  border: 2.5px solid #c0392b;
                  border-radius: 50%%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 26px;
                  color: #c0392b;
                }
                h1 {
                  font-size: 30px;
                  font-weight: 700;
                  color: #1a1208;
                  margin: 0 0 8px;
                }
                p {
                  font-size: 19px;
                  color: #5a4020;
                  line-height: 1.5;
                  margin: 0;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="brand">Histórias <span>Anônimas</span></div>
                <div class="cross">✕</div>
                <h1>Link inválido ou expirado</h1>
                <p>Não foi possível ativar sua conta. O link de confirmação pode ter expirado ou já ter sido usado.</p>
              </div>
            </body>
            </html>
            """;

        return ResponseEntity.badRequest().body(errorHtml);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO dto){
        userService.processForgotPassword(dto);
        return ResponseEntity.ok(Map.of( "message", "Se este endereço de e-mail estiver cadastrado em nossa plataforma, você receberá um link para redefinir sua senha."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword (@Valid @RequestBody ResetPasswordRequestDTO dto){
        userService.resetPassword(dto);
        return ResponseEntity.ok(Map.of(
                "message", "Senha alterada com sucesso! Agora você pode acessar sua conta com a nova senha."
        ));
    }
}