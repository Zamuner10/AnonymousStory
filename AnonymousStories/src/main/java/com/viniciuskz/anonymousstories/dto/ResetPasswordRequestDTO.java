package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDTO (

        @NotBlank(message="Token obrigatório")
        String token,

        @NotBlank(message="Nova senha obrigatótia")
        @Size(min=8, message="A senha deve ter no mínimo 8 caracteres")
        String newPassword
) {}
