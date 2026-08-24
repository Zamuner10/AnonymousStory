package com.viniciuskz.anonymousstories.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciuskz.anonymousstories.dto.StoryRequestDTO;
import com.viniciuskz.anonymousstories.dto.StoryResponseDTO;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.exception.GlobalExceptionHandler;
import com.viniciuskz.anonymousstories.exception.ResourceNotFoundException;
import com.viniciuskz.anonymousstories.service.StoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

// imports estáticos...
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class StoryControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private StoryService storyService;

    @InjectMocks
    private StoryController storyController;

    @BeforeEach
    void setUp(){
        this.mockMvc = MockMvcBuilders.standaloneSetup(storyController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("It should return status 201 Created when creating a story.")
    void createStory_ShouldReturnCreated() throws Exception {
        StoryRequestDTO requestDTO = new StoryRequestDTO("Title Web Test", "HTTP request content for testing story creation...");
        StoryResponseDTO responseDTO = new StoryResponseDTO(1L, "Title Web Test", "HTTP request content for testing story creation...", LocalDateTime.now());

        // Passa os 2 argumentos exigidos pelo método do StoryService (DTO e User)
        when(storyService.createStory(any(StoryRequestDTO.class), org.mockito.ArgumentMatchers.nullable(User.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(post("/stories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Title Web Test"))
                .andExpect(jsonPath("$.content").value("HTTP request content for testing story creation..."));
    }

    @Test
    @DisplayName("It should return status 200 OK when searching for a story by ID")
    void getStoryById_ShouldReturnOk()throws Exception{
        StoryResponseDTO responseDTO = new StoryResponseDTO(1L, "History Found", "Content Returned...", LocalDateTime.now());

        when(storyService.findById(1L)).thenReturn(responseDTO);

        mockMvc.perform(get("/stories/1")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.title").value("History Found"));

    }

    @Test
    @DisplayName("It should return status 404 Not Found when story ID does not exist")
    void getStoryById_ShouldReturnNotFound() throws Exception {
        when(storyService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Story not found"));

        mockMvc.perform(get("/stories/99")
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isNotFound());
    }


}
