package com.viniciuskz.anonymousstories.service;


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
    }


