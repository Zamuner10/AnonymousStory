package com.viniciuskz.anonymousstories.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciuskz.anonymousstories.dto.UserRequestDTO;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.exception.GlobalExceptionHandler;
import com.viniciuskz.anonymousstories.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.http.MediaType;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import static org.mockito.ArgumentMatchers.any;



@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(new LocalValidatorFactoryBean())
                .build();
    }

    @Test
    @DisplayName("It should return status 201 Created when registering a new user")
    void registerUser_ShouldReturnCreated() throws Exception{
        UserRequestDTO requestDTO = new UserRequestDTO(
                "Vinicius",
                "test@email.com",
                "V12345*",
                "V12345*",
                29
        );


        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Vinicius");
        mockUser.setEmail("test@email.com");
        mockUser.setAge(29);
        mockUser.setPassword("V12345*");


        when(userService.registerUser(any(UserRequestDTO.class))).thenReturn(mockUser);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andDo(print())
                .andExpect(status().isCreated());

    }

    @Test
    @DisplayName("Should return status 400 Bad Request when request DTO is invalid")
    void registerUser_ShouldReturnBadRequest_WhenDtoIsInvalid() throws Exception{
        UserRequestDTO invalidDto = new UserRequestDTO(
                "",
                "email-invalid",
                "",
                "",
                10
        );
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return status 400 Bad Request when age is null")
    void registerUser_ShouldReturnBadRequest_WhenAgeIsNull() throws Exception{
        UserRequestDTO invalidDto = new UserRequestDTO(
                "Vinicius",
                "test@email.com",
                "V12345*",
                "V12345*",
                null
        );
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }
}
