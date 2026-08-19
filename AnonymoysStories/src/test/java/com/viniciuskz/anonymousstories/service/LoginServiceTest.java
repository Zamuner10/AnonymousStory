package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.LoginRequestDTO;
import com.viniciuskz.anonymousstories.dto.LoginResponseDTO;
import com.viniciuskz.anonymousstories.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoginServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private LoginService loginService;

    @Test
    @DisplayName("Should authenticate user and return token successfully")
    void login_Sucess(){

        //ARRANGE
        LoginRequestDTO requestDTO = new LoginRequestDTO("test@email.com", "123456");

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test user");
        mockUser.setEmail("test@email.com");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenService.generateToken(mockUser)).thenReturn("mocked-jwt-token");

        //ACT
        LoginResponseDTO response = loginService.login(requestDTO);

        //ASSERT
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test user", response.getName());
        assertEquals("test@email.com", response.getEmail());
        assertEquals("mocked-jwt-token", response.getToken());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenService, times(1)).generateToken(mockUser);
    }

}
