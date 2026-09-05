package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDTO (

    @NotBlank(message="E-mail is required")
    @Email(message="Please provide a valid email address")
    String email
){ }
