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
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new LoginResponseDTO("Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response){
        ResponseCookie cookei = ResponseCookie.from("jwtToken", "")
                .httpOnly(true)
                .secure(isSecureCookie)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookei.toString());
        return ResponseEntity.ok().build();
    }
}