package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequestDTO (

    @NotBlank(message = "Nome é obrigatório")
    String name,

    @NotBlank (message = "E-mail é obrigatório")
    @Email(message = "Formato inválido")
    String email,

    @NotBlank (message = "Senha é obrigatório")
    String password,

    @NotBlank (message = "Confirmar senha obrigatório" )
    String confirmPassword,

    @NotNull (message = "Idade obrigatória")
    @Min(value = 13, message= "O usuário deve ter pelo menos 13 anos de idade")
    Integer age

            ){}