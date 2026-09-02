package com.viniciuskz.anonymousstories.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciuskz.anonymousstories.controller.StoryController;
import com.viniciuskz.anonymousstories.dto.StoryRequestDTO;
import com.viniciuskz.anonymousstories.exception.GlobalExceptionHandler;
import com.viniciuskz.anonymousstories.service.StoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
public class StorySecurityTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private StoryService storyService;

    @InjectMocks
    private StoryController storyController;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(this.storyController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("User A attempting to edit User B's Story should return 403 Forbidden")
    void userA_CannotEdit_UserBStory() throws Exception {
        // Textos longos para garantir o cumprimento das regras de Bean Validation (@Size)
        StoryRequestDTO updateDto = new StoryRequestDTO(
                "Edited Title Valid",
                "This is valid content with enough length to bypass DTO validation rules smoothly.",
                true
        );

        Mockito.when(this.storyService.updateStory(eq(1L), any(StoryRequestDTO.class), any()))
                .thenThrow(new AccessDeniedException("You do not have permission to edit this story"));

        this.mockMvc.perform(MockMvcRequestBuilders.put("/stories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.objectMapper.writeValueAsString(updateDto)))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    @DisplayName("User A attempting to delete User B's Story should return 403 Forbidden")
    void userA_CannotDelete_UserBStory() throws Exception {
        Mockito.doThrow(new AccessDeniedException("You do not have permission to delete this story"))
                .when(this.storyService).deleteStory(eq(1L), any());

        this.mockMvc.perform(MockMvcRequestBuilders.delete("/stories/1"))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }
}