package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.StoryRequestDTO;
import com.viniciuskz.anonymousstories.dto.StoryResponseDTO;
import com.viniciuskz.anonymousstories.entity.Story;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.exception.ContentModerationException;
import com.viniciuskz.anonymousstories.repository.StoryRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StoryServiceTest {

    @Mock
    private StoryRepository storyRepository;

    @Mock
    private ContentModerationService contentModerationService;

    @InjectMocks
    private StoryService storyService;

    @Test
    @DisplayName("You must create a successful story.")
    void createStory_Sucess() {
        // Arrange
        StoryRequestDTO requestDTO = new StoryRequestDTO("Title the History", "My Story Content of the anonymous story...", true);

        User author = new User();
        author.setId(1L);
        author.setName("Anonumous");
        author.setEmail("auth@email.com");

        Story savedStory = new Story();
        savedStory.setId(1L);
        savedStory.setTitle(requestDTO.title());
        savedStory.setContent(requestDTO.content());
        savedStory.setAnonymous(true);
        savedStory.setUser(author);
        savedStory.setCreatedAt(LocalDateTime.now());

        doNothing().when(contentModerationService).validateText(anyString());
        when(storyRepository.save(any(Story.class))).thenReturn(savedStory);

        // ACT
        StoryResponseDTO response = storyService.createStory(requestDTO, author);

        // Assert
        assertNotNull(response);
        assertEquals("Title the History", response.title());
        assertEquals("My Story Content of the anonymous story...", response.content());
        verify(contentModerationService, times(1)).validateText("Title the History My Story Content of the anonymous story...");
        verify(storyRepository, times(1)).save(any(Story.class));
    }

    @Test
    @DisplayName("Should throw ContentModerationException and NOT save story when content is inappropriate")
    void createStory_InappropriateContent_ThrowsException() {
        // ARRANGE
        StoryRequestDTO dto = new StoryRequestDTO("Título Inadequado", "Conteúdo com discurso de ódio.", true);
        User user = new User();
        user.setId(1L);

        doThrow(new ContentModerationException("O conteúdo enviado viola os termos de uso."))
                .when(contentModerationService).validateText(anyString());

        // ACT E ASSERT
        assertThrows(ContentModerationException.class, () -> storyService.createStory(dto, user));

        // Garantir que o repositório nunca foi chamado para salvar
        verify(storyRepository, never()).save(any(Story.class));
    }

    @Test
    @DisplayName("You should be able to successfully search for a story by ID.")
    void findById_Succes() {
        // Arrange
        Story story = new Story();
        story.setId(1L);
        story.setTitle("Found story");
        story.setContent("Story content...");

        when(storyRepository.findById(1L)).thenReturn(Optional.of(story));

        // ACT
        StoryResponseDTO response = storyService.findById(1L);

        // Assert
        assertNotNull(response);
        assertEquals("Found story", response.title());
        assertEquals("Story content...", response.content());
        verify(storyRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("An exception must be made when the story cannot be found.")
    void findById_ThrowsException_WhenNotFound() {
        // Arrange
        when(storyRepository.findById(99L)).thenReturn(Optional.empty());

        // ACT & Assert
        assertThrows(RuntimeException.class, () -> storyService.findById(99L));
        verify(storyRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("It should return authorDisplayName as 'Anônimo' when anonymous is true")
    void createStory_WithAnonymousTrue_ReturnsAnonymousDisplayName() {
        // Arrange
        StoryRequestDTO requestDTO = new StoryRequestDTO("Valid Title", "This content has more than thirty characters to pass validation", true);

        User author = new User();
        author.setId(1L);
        author.setName("Carlos Silva");

        Story savedStory = new Story();
        savedStory.setId(1L);
        savedStory.setTitle(requestDTO.title());
        savedStory.setContent(requestDTO.content());
        savedStory.setAnonymous(true);
        savedStory.setUser(author);

        doNothing().when(contentModerationService).validateText(anyString());
        when(storyRepository.save(any(Story.class))).thenReturn(savedStory);

        // Act
        StoryResponseDTO response = storyService.createStory(requestDTO, author);

        // Assert
        assertNotNull(response);
        assertTrue(response.anonymous());
        assertEquals("Anônimo", response.authorDisplayName());
    }

    @Test
    @DisplayName("It should return authorDisplayName with the user name when anonymous is false")
    void createStory_WithAnonymousFalse_ReturnsUserNameDisplayName() {
        // Arrange
        StoryRequestDTO requestDTO = new StoryRequestDTO("Valid Title", "This content has more than thirty characters to pass validation", false);

        User author = new User();
        author.setId(1L);
        author.setName("Carlos Silva");

        Story savedStory = new Story();
        savedStory.setId(1L);
        savedStory.setTitle(requestDTO.title());
        savedStory.setContent(requestDTO.content());
        savedStory.setAnonymous(false);
        savedStory.setUser(author);

        doNothing().when(contentModerationService).validateText(anyString());
        when(storyRepository.save(any(Story.class))).thenReturn(savedStory);

        // Act
        StoryResponseDTO response = storyService.createStory(requestDTO, author);

        // Assert
        assertNotNull(response);
        assertFalse(response.anonymous());
        assertEquals("Carlos Silva", response.authorDisplayName());
    }
}