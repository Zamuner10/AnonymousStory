package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.UserRequestDTO;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public User registerUser(UserRequestDTO dto) {

        if (!dto.password().equals(dto.confirmPassword())) {
            throw new IllegalArgumentException("The passwords don't match!");
        }


        validateEmailAlreadyExist(dto.email());
        validateName(dto.name());
        validatePassword(dto.password());


        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setAge(dto.age());


        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setIsVerified(false);


        User savedUser = userRepository.save(user);
        emailService.sendVerificationEmail(savedUser.getEmail(), token);

        return savedUser;
    }

    public boolean verifyUser(String token) {
        Optional<User> userOptional = userRepository.findByVerificationToken(token);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setIsVerified(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    private void validateEmailAlreadyExist(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            throw new IllegalArgumentException("The email address is already registered.");
        }
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("The name cannot be empty.");
        }

        char firstLetter = name.charAt(0);
        if (!Character.isUpperCase(firstLetter)) {
            throw new IllegalArgumentException("The first letter must be capitalized.");
        }

        for (int i = 0; i < name.length(); i++) {
            char ch = name.charAt(i);

            if (Character.isDigit(ch)) {
                throw new IllegalArgumentException("The name cannot contain numbers.");
            }

            if (!Character.isLetter(ch) && !Character.isWhitespace(ch)) {
                throw new IllegalArgumentException("The name cannot contain special characters.");
            }
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("The password cannot be empty.");
        }

        boolean hasLetter = false;
        boolean hasUpperCase = false;
        boolean hasDigit = false;
        boolean hasSpecialChar = false;

        for (int i = 0; i < password.length(); i++) {
            char ch = password.charAt(i);

            if (Character.isLetter(ch)) {
                hasLetter = true;
            }
            if (Character.isUpperCase(ch)) {
                hasUpperCase = true;
            }
            if (Character.isDigit(ch)) {
                hasDigit = true;
            }
            if (!Character.isLetterOrDigit(ch) && !Character.isWhitespace(ch)) {
                hasSpecialChar = true;
            }
        }

        if (!hasLetter) {
            throw new IllegalArgumentException("Password must contain at least one letter.");
        }
        if (!hasUpperCase) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter.");
        }
        if (!hasDigit) {
            throw new IllegalArgumentException("Password must contain at least one number.");
        }
        if (!hasSpecialChar) {
            throw new IllegalArgumentException("Password must contain at least one special character.");
        }
    }
}