package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.StoryRequestDTO;
import com.viniciuskz.anonymousstories.dto.StoryResponseDTO;
import com.viniciuskz.anonymousstories.entity.Story;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.StoryRepository;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    public StoryService(StoryRepository storyRepository, UserRepository userRepository) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }
    // Criar história (Usando DTO e associando o Usuário)
    public StoryResponseDTO createStory(StoryRequestDTO dto, User user) {

        Story story = new Story();
        story.setTitle(dto.title());
        story.setContent(dto.content());
        story.setUser(user);
        story.setCreatedAt(LocalDateTime.now());

        Story savedStory = storyRepository.save(story);
        return new StoryResponseDTO(savedStory);
    }

    // Buscar história por ID (Seus métodos mantidos e adaptados para DTO)
    public StoryResponseDTO findById(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Story not found with ID: " + id));
        return new StoryResponseDTO(story);
    }

    // Listar todas as histórias públicas (Feed Principal)
    public List<StoryResponseDTO> getAllStories() {
        return storyRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(StoryResponseDTO::new)
                .toList();
    }

    // Listar histórias do usuário logado
    public List<StoryResponseDTO> getStoriesByUserId(Long userId){
        return storyRepository.findByUserId(userId)
                .stream()
                .map(StoryResponseDTO::new)
                .toList();
    }

    // Deletar história (Seu método mantido)
    public void deleteStory(Long id){
        if(!storyRepository.existsById(id)){
            throw new IllegalArgumentException("History not found for deletion with ID: " + id);
        }
        storyRepository.deleteById(id);
    }


}
