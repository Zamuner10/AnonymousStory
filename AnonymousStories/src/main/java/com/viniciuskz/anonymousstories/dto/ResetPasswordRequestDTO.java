package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDTO (

        @NotBlank(message="Token is requerid")
        String token,

        @NotBlank(message="The new password is requerid")
        @Size(min=8, message="The password must be a least 8 characters long")
        String newPassword
) {}
