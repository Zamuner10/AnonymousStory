package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.dto.StoryRequestDTO;
import com.viniciuskz.anonymousstories.dto.StoryResponseDTO;
import com.viniciuskz.anonymousstories.entity.Story;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.exception.ResourceNotFoundException;
import com.viniciuskz.anonymousstories.repository.StoryRepository;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final ContentModerationService contentModerationService;

    public StoryService(StoryRepository storyRepository,
                        UserRepository userRepository,
                        ContentModerationService contentModerationService) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.contentModerationService = contentModerationService;
    }

    // Criar história (definindo o campo 'anonymous')
    @Transactional
    public StoryResponseDTO createStory(StoryRequestDTO dto, User user) {

        // 1. Validações de moderacao de conteudo (PII, Spam, Profanidade)
        contentModerationService.validateText(dto.title() + " " + dto.content());

        // 2. Trata valor nulo definindo o anonimato como true por padrão
        // CORRIGIDO: era dto.isAnonymous() — o record StoryRequestDTO
        // chama o componente "anonymous", não "isAnonymous". Chamar o
        // nome errado nem compilaria se o record realmente tivesse esse
        // componente — o bug de verdade estava no NOME do campo do DTO,
        // que foi corrigido lá; aqui só ajustamos a chamada de volta pra
        // bater com esse nome.
        boolean isAnon = dto.anonymous() != null ? dto.anonymous() : true;

        Story story = new Story();
        story.setTitle(dto.title());
        story.setContent(dto.content());
        story.setAnonymous(isAnon);
        story.setUser(user);
        story.setCreatedAt(LocalDateTime.now());

        // 3. Salva no banco e retorna o DTO formatado com o nome do autor correto
        Story savedStory = storyRepository.save(story);
        return new StoryResponseDTO(savedStory);
    }

    @Transactional(readOnly = true)
    public StoryResponseDTO findById(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with ID: " + id));
        return new StoryResponseDTO(story);
    }

    @Transactional(readOnly = true)
    public List<StoryResponseDTO> getAllStories() {
        return storyRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(StoryResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StoryResponseDTO> getStoriesByUserId(Long userId) {
        return storyRepository.findByUserId(userId)
                .stream()
                .map(StoryResponseDTO::new)
                .toList();
    }

    @Transactional
    public StoryResponseDTO updateStory(Long id, StoryRequestDTO dto, User currentUser) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with ID: " + id));

        if (!story.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Você não tem permissão para editar esta história.");
        }

        contentModerationService.validateText(dto.title() + " " + dto.content());

        story.setTitle(dto.title());
        story.setContent(dto.content());
        if (dto.anonymous() != null) {
            story.setAnonymous(dto.anonymous());
        }

        Story updatedStory = storyRepository.save(story);
        return new StoryResponseDTO(updatedStory);
    }

    @Transactional
    public void deleteStory(Long id, User currentUser) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found for deletion with ID: " + id));

        if (!story.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Você não tem permissão para deletar esta história.");
        }
        storyRepository.delete(story);
    }
}