package com.viniciuskz.anonymousstories.controller;


import com.viniciuskz.anonymousstories.dto.StoryRequestDTO;
import com.viniciuskz.anonymousstories.dto.StoryResponseDTO;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.service.StoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService){
        this.storyService = storyService;
    }

    //Criar Histórias
    @PostMapping
    public ResponseEntity<StoryResponseDTO> createStory(
            @Valid @RequestBody StoryRequestDTO dto,
            @AuthenticationPrincipal User user){

        StoryResponseDTO createdStory = storyService.createStory(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStory);
    }

    //Feed principal
    @GetMapping
    public ResponseEntity<List<StoryResponseDTO>> getAllStories(){
        List<StoryResponseDTO> stories = storyService.getAllStories();
        return ResponseEntity.ok(stories);
    }

    //Buscar pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<StoryResponseDTO> getStoryById(@PathVariable Long id){
        StoryResponseDTO story = storyService.findById(id);
        return ResponseEntity.ok(story);
    }


    //Listar apenas histórias do usuário autenticado
    @GetMapping("/my-stories")
    public ResponseEntity<List<StoryResponseDTO>> getMyStories(@AuthenticationPrincipal User user){
        List<StoryResponseDTO> stories = storyService.getStoriesByUserId(user.getId());
        return ResponseEntity.ok(stories);
    }

    //Deletar história por id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory (@PathVariable Long id){
        storyService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }

}
