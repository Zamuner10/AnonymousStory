package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequestDTO (

    @NotBlank(message = "Name is mandatory")
    String name,

    @NotBlank (message = "Email is required.")
    @Email(message = "Format invalid")
    String email,

    @NotBlank (message = " PassWord is required.")
    String password,

    @NotBlank (message = "Password confirmation is required." )
    String confirmPassword,

    @NotBlank (message = "Age is mandatory")
    Integer age

            ){}