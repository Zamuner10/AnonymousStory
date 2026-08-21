package com.viniciuskz.anonymousstories.dto;

import com.viniciuskz.anonymousstories.entity.Story;

import java.time.LocalDateTime;

public record StoryResponseDTO(
        Long id,
        String title,
        String content,
        LocalDateTime createdAt
) {
    // Construtor auxiliar que recebe uma única entidade Story
    public StoryResponseDTO(Story story) {
        this(
                story.getId(),
                story.getTitle(),
                story.getContent(),
                story.getCreatedAt()
        );
    }
}
