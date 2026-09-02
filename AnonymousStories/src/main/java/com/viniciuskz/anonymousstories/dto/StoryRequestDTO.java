package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StoryRequestDTO(
        @NotBlank(message = "Title is requerid")
        @Size(min = 5,  max = 80, message = "Title must be between 5 and 80 characters")
        String title,

        @NotBlank(message = "Content is requerid")
        @Size(min = 30, max = 500, message = "Content must be between 30 and 500 characters")
        String content,

        Boolean anonymous
) {
        public StoryRequestDTO{
                if(anonymous==null){
                        anonymous=true;
                }
        }
}