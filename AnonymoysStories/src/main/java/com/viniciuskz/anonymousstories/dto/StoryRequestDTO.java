package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StoryRequestDTO(
        @NotBlank(message = "O título não pode estar em branco")
        @Size(max = 100, message = "O título deve ter no máximo 100 caracteres")
        String title,

        @NotBlank(message = "O conteúdo da história não pode estar em branco")
        String content
) {}