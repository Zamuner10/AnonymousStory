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

@RestController
@RequestMapping("/login")
public class LoginController {

    private final LoginService loginService;

    @Value("${app.cookie.secure:false}")
    private boolean isSecureCookie;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO request, HttpServletResponse response) {
        LoginResponseDTO loginResponse = loginService.login(request);

        ResponseCookie cookie = ResponseCookie.from("accessToken", loginResponse.getToken())
                .httpOnly(true)
                .secure(isSecureCookie)
                .path("/")
                .maxAge(7*24*60*60)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(loginResponse);
    }
}