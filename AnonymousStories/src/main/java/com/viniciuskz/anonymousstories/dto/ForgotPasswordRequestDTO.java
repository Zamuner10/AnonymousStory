package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDTO (

    @NotBlank(message="E-mail obrigatório")
    @Email(message="Por favor, forneça um endereço de e-mail válido ")
    String email
){ }
