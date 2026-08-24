package com.viniciuskz.anonymousstories.dto;


import com.viniciuskz.anonymousstories.entity.User;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        boolean isVerified
) {
    public UserResponseDTO(User user){
        this(user.getId(), user.getName(), user.getEmail(), user.getIsVerified());
    }
}
