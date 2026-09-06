package com.viniciuskz.anonymousstories.dto;

import com.viniciuskz.anonymousstories.entity.Story;
import java.time.LocalDateTime;

public record StoryResponseDTO(
        Long id,
        String title,
        String content,
        // CORRIGIDO: estava "isAnonymous" — mesmo motivo do
        // StoryRequestDTO. Aqui o efeito era menos grave (é só a resposta
        // saindo, não entrando), mas mantemos os dois consistentes.
        boolean anonymous,
        String authorDisplayName,
        LocalDateTime createdAt
) {
    // Construtor auxiliar que recebe a Entidade Story e calcula o authorDisplayName
    public StoryResponseDTO(Story story) {
        this(
                story.getId(),
                story.getTitle(),
                story.getContent(),
                story.isAnonymous(),
                (!story.isAnonymous() && story.getUser() != null) ? story.getUser().getName() : "Anônimo",
                story.getCreatedAt()
        );
    }
}