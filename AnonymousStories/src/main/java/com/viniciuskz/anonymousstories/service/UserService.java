package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.ForgotPasswordRequestDTO;
import com.viniciuskz.anonymousstories.dto.ResetPasswordRequestDTO;
import com.viniciuskz.anonymousstories.dto.UserRequestDTO;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

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

        // Dispara o e-mail de verificação de cadastro
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

    public void resendVerificationToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Verifica se o usuário ainda não confirmou o cadastro
            Boolean isVerified = user.getIsVerified();
            if (isVerified == null || !isVerified) {
                String token = UUID.randomUUID().toString();
                user.setVerificationToken(token);

                userRepository.save(user);

                emailService.sendVerificationEmail(user.getEmail(), token);
            }
        }
    }

    @Transactional
    public void processForgotPassword(ForgotPasswordRequestDTO dto) {
        Optional<User> userOptional = userRepository.findByEmail(dto.email());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();

            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
            userRepository.save(user);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequestDTO dto) {
        User user = userRepository.findByPasswordResetToken(dto.token())
                .orElseThrow(() -> new IllegalArgumentException("Token de redefinição de senha inválido ou inexistente."));

        if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("O link para redefinição de senha expirou. Solicite um novo link.");
        }

        // Valida regras de complexidade da nova senha
        validatePassword(dto.newPassword());

        // Criptografa a nova senha com BCrypt
        user.setPassword(passwordEncoder.encode(dto.newPassword()));

        // Ativa a conta automaticamente ao redefinir a senha
        user.setIsVerified(true);
        user.setVerificationToken(null);

        // Limpa os tokens de redefinição
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);

        userRepository.save(user);
    }

    private void validateEmailAlreadyExist(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            throw new IllegalArgumentException("Esse endereço de e-mail já está cadastrado");
        }
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nome não pode ficar vazio.");
        }

        char firstLetter = name.charAt(0);
        if (!Character.isUpperCase(firstLetter)) {
            throw new IllegalArgumentException("A primeira letra deve ser maiúscula");
        }

        for (int i = 0; i < name.length(); i++) {
            char ch = name.charAt(i);

            if (Character.isDigit(ch)) {
                throw new IllegalArgumentException("O nome não pode conter números.");
            }

            if (!Character.isLetter(ch) && !Character.isWhitespace(ch)) {
                throw new IllegalArgumentException("O nome não pode conter caracteres especiais");
            }
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("A senha não pode estar vazia.");
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
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra");
        }
        if (!hasUpperCase) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra maiúscula.");
        }
        if (!hasDigit) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um número.");
        }
        if (!hasSpecialChar) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um caractere especial");
        }
    }
}