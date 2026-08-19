package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
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

    @NotNull (message = "Age is required")
    @Min(value = 12, message= "Age must be at least 12")
    Integer age

            ){}