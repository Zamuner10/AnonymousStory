package com.viniciuskz.anonymousstories.controller;


import com.viniciuskz.anonymousstories.dto.UserRequestDTO;
import com.viniciuskz.anonymousstories.dto.UserResponseDTO;
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



@RestController
@RequestMapping ("/users")
public class
UserController {


    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserRequestDTO dto) {
        User registeredUser = userService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
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
            String loginPageUrl = "http://localhost:8080/login"; // Altere quando tiver a tela de login no front

            String successHtml = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Conta Ativada - Anonymous Stories</title>
                  <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-slate-100 min-h-screen flex items-center justify-center p-4 antialiased">
                  <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                    <div class="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">
                      ✓
                    </div>
                    <h1 class="text-2xl font-bold text-slate-800 tracking-tight mb-2">Conta Ativada com Sucesso!</h1>
                    <p class="text-slate-600 text-sm leading-relaxed mb-8">
                      Sua conta foi verificada. Você já pode acessar a plataforma para publicar e ler histórias de forma totalmente anônima.
                    </p>
                    <a href="%s" class="inline-block w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95">
                      Ir para o Login
                    </a>
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
              <title>Erro na Ativação - Anonymous Stories</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-slate-100 min-h-screen flex items-center justify-center p-4 antialiased">
              <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                <div class="mx-auto w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">
                  ✕
                </div>
                <h1 class="text-2xl font-bold text-slate-800 tracking-tight mb-2">Link Inválido ou Expirado</h1>
                <p class="text-slate-600 text-sm leading-relaxed mb-8">
                  Não foi possível ativar sua conta. O link de confirmação pode ter expirado ou já ter sido utilizado.
                </p>
              </div>
            </body>
            </html>
            """;

        return ResponseEntity.badRequest().body(errorHtml);
    }
}