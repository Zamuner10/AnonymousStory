package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.StoryRequestDTO;
import com.viniciuskz.anonymousstories.dto.StoryResponseDTO;
import com.viniciuskz.anonymousstories.entity.Story;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.exception.ResourceNotFoundException;
import com.viniciuskz.anonymousstories.repository.StoryRepository;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final ContentModerationService contentModerationService;


    public StoryService(StoryRepository storyRepository, UserRepository userRepository, ContentModerationService contentModerationService) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.contentModerationService = contentModerationService;
    }

    // Criar história (Usando DTO e associando o Usuário)
    @Transactional
    public StoryResponseDTO createStory(StoryRequestDTO dto, User user) {

        contentModerationService.validateText(dto.title() + " " + dto.content()); //valida titulo e conteúdo juntos na API de IA

        Story story = new Story();
        story.setTitle(dto.title());
        story.setContent(dto.content());
        story.setUser(user);
        story.setCreatedAt(LocalDateTime.now());

        Story savedStory = storyRepository.save(story);
        return new StoryResponseDTO(savedStory);
    }

    @Transactional(readOnly = true)
    // Buscar história por ID (Seus métodos mantidos e adaptados para DTO)
    public StoryResponseDTO findById(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Story not found with ID: " + id));
        return new StoryResponseDTO(story);
    }

    @Transactional(readOnly = true)
    // Listar todas as histórias públicas (Feed Principal)
    public List<StoryResponseDTO> getAllStories() {
        return storyRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(StoryResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StoryResponseDTO> getStoriesByUserId(Long userId){
        return storyRepository.findByUserId(userId)
                .stream()
                .map(StoryResponseDTO::new)
                .toList();
    }

    @Transactional
    // Listar histórias do usuário logado
    public StoryResponseDTO updateStory(Long id, StoryRequestDTO dto, User currentUser) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with ID: " + id));

        if (!story.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Você não tem permissão para editar esta história.");
        }

        contentModerationService.validateText(dto.title() + " " + dto.content());

        story.setTitle(dto.title());
        story.setContent(dto.content());

        Story updatedStory = storyRepository.save(story);
        return new StoryResponseDTO(updatedStory);
    }
    @Transactional
    // Deletar história (Seu método mantido)
    public void deleteStory(Long id,  User currentUser){
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found for deletion with ID: " + id));

        if (!story.getUser().getId().equals(currentUser.getId())){
            throw new AccessDeniedException("Você não tem permissão para deletar esta história.");
        }
        storyRepository.delete(story);
    }
}
