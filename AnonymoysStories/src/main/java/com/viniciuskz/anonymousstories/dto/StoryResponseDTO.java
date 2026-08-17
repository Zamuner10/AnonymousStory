package com.viniciuskz.anonymousstories.dto;

import com.viniciuskz.anonymousstories.entity.Story;

import java.time.LocalDateTime;

public record StoryResponseDTO(
        Long id,
        String title,
        String content,
        LocalDateTime createdAt
) {
    public StoryResponseDTO (Story story){
        this(story.getId(), story.getTitle(), story.getContent(), story.getCreatedAt());

    }
}
