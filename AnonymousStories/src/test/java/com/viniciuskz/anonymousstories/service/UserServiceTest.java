package com.viniciuskz.anonymousstories.service;


import com.viniciuskz.anonymousstories.dto.ForgotPasswordRequestDTO;
import com.viniciuskz.anonymousstories.dto.ResetPasswordRequestDTO;
import com.viniciuskz.anonymousstories.dto.UserRequestDTO;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("You must validate the initial test structure.")
    void createUser_Success() {

        //Arrange (Preparação de Dados)
        UserRequestDTO requestDTO = new UserRequestDTO("Test User", "test@email.com", "Senha123456*", "Senha123456*", 20);
        User saveUser = new User();
        saveUser.setId(1L);
        saveUser.setName(requestDTO.name());
        saveUser.setEmail(requestDTO.email());
        saveUser.setPassword("encodedPassword");

        when(userRepository.findByEmail(requestDTO.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(requestDTO.password())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(saveUser);

        //ACT (execução da ação)
        User response = userService.registerUser(requestDTO);


        //Assert (Validação do resultado)
        assertNotNull(response);
        assertEquals("Test User", response.getName());
        assertEquals("test@email.com", response.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailService, times(1)).sendVerificationEmail(anyString(), anyString());
    }
    @Test
    @DisplayName("An exception should be thrown when the email address is already registered.")
    void createUser_ThrowsException_WhenEmailExists(){

        //Arrange
        UserRequestDTO requestDTO = new UserRequestDTO("Test User", "test@email.com", "Senha123456*", "Senha123456*", 20);
        when(userRepository.findByEmail(requestDTO.email())).thenReturn(Optional.of(new User()));

        //ACT & Assert
        assertThrows(RuntimeException.class, () -> userService.registerUser(requestDTO));
        verify(userRepository, never()).save(any(User.class));

    }

    @Test
    @DisplayName("Should verify user successfully when token is valid")
    void verifyUser_Sucess(){

        //Arrange
        String token = "valid-token";
        User user = new User();
        user.setVerificationToken(token);
        user.setIsVerified(false);

        when(userRepository.findByVerificationToken(token)).thenReturn(Optional.of(user));

        //ACT
        boolean result = userService.verifyUser(token);

        //ASSERT
        assertTrue(result);
        assertTrue(user.getIsVerified());
        assertNull(user.getVerificationToken());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("Should return false when verification token does not exist")
    void verifyUser_TokenNotFound_ReturnsFalse(){

        //ARRANGE
        String invalidToken = "invalid-token";
        when(userRepository.findByVerificationToken(invalidToken)).thenReturn(Optional.empty());

        //ACT
        boolean result = userService.verifyUser(invalidToken);

        //ASSERT
        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("You must generate a token and send an email when requesting a reset for an existing email addreess.")
    void processForgotPassword_ExisingEmail_GeneratesTokenAndSendsEmail(){
        ForgotPasswordRequestDTO dto = new ForgotPasswordRequestDTO("test@email.com");
        User user = new  User();
        user.setEmail("test@email.com");

        when(userRepository.findByEmail("test@email.com")).thenReturn(Optional.of(user));
        userService.processForgotPassword(dto);

        assertNotNull(user.getPasswordResetToken());
        assertNotNull(user.getPasswordResetTokenExpiry());
        assertTrue(user.getPasswordResetTokenExpiry().isAfter(LocalDateTime.now()));
        verify(userRepository, times(1)).save(user);
        // CORRIGIDO: o e-mail verificado aqui precisa ser o MESMO
        // e-mail do usuário criado logo acima ("test@email.com").
        // Estava "carlos@email.com" — um e-mail que não existe em
        // lugar nenhum deste teste, então o Mockito nunca encontraria
        // essa chamada de verdade, e o teste falhava sempre.
        verify(emailService, times(1)).sendPasswordResetEmail(eq("test@email.com"), anyString());
    }

    @Test
    @DisplayName("Do not generate an error or send an email when requesting a reset for a non-existent email address. ")
    void processForgotPasswor_NonExistingEmail_DoesNothingSilently(){
        ForgotPasswordRequestDTO dto = new ForgotPasswordRequestDTO("inexistente@email.com");
        when(userRepository.findByEmail("inexistente@email.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> userService.processForgotPassword(dto));

        verify(userRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
    }

    @Test
    @DisplayName("You should successfully reset your password using a valid token")
    void resetPassword_ValidToken_UpdatePasswordAndClearsToken(){
        String validToken ="token-valid";
        ResetPasswordRequestDTO dto = new ResetPasswordRequestDTO(validToken, "newPassword123");

        User user = new User();
        user.setEmail("test@email.com");
        // CORRIGIDO: antes estava "user.setPassword(validToken)" — isso
        // seta a SENHA do usuário com o valor do token, não o campo
        // que o resetPassword() de verdade procura
        // (getPasswordResetToken()). Sem essa linha certa, o serviço
        // nunca encontra o usuário dono desse token, porque o campo
        // ficava null.
        user.setPasswordResetToken(validToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        when(userRepository.findAll()).thenReturn(List.of(user));
        when(passwordEncoder.encode("newPassword123")).thenReturn("EncryptedPassword");

        userService.resetPassword(dto);

        assertEquals("EncryptedPassword", user.getPassword());
        assertNull(user.getPasswordResetToken());
        assertNull(user.getPasswordResetTokenExpiry());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("An exception should be thrown when attempting to reset a password with an expired toked")
    void resetPassword_ExpiredToken_ThrowsException(){
        ResetPasswordRequestDTO dto = new ResetPasswordRequestDTO("token-expired", "newPassword123");
        User user = new User();
        user.setPasswordResetToken("token-expired");
        user.setPasswordResetTokenExpiry(LocalDateTime.now().minusMinutes(5)); // Expirou há 5 min

        when(userRepository.findAll()).thenReturn(List.of(user));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> userService.resetPassword(dto));
        assertTrue(ex.getMessage().contains("expired"));
    }

    @Test
    @DisplayName("You shoould throw an exception when attempting to reset a password with a non-existent token")
    void resetPassword_InvalidToken_ThrowsException(){
        ResetPasswordRequestDTO dto = new ResetPasswordRequestDTO("gosth-token", "newPassword123");
        when(userRepository.findAll()).thenReturn(List.of());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> userService.resetPassword(dto));
        assertTrue(ex.getMessage().contains("token"));
    }
}