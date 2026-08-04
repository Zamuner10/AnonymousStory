package com.viniciuskz.anonymousstories.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;

import com.viniciuskz.anonymousstories.entity.Story;
import com.viniciuskz.anonymousstories.service.StoryService;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService){
        this.storyService = storyService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Story> createStory(@PathVariable Long userId, @Valid @RequestBody Story story){
        Story createStory = storyService.createStory(userId, story);
        return ResponseEntity.status(HttpStatus.CREATED).body(createStory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Story> getStorydById(@PathVariable Long id){
        Story story = storyService.findById(id);
        return ResponseEntity.ok(story);
    }   

//    @GetMapping("/random")
//    public ResponseEntity<List<Story>> getRandomStory(){
//        List<Story> story = storyService.findRandomStory();
//        return ResponseEntity.ok(story);
//    }
//

    @DeleteMapping("/{id}")
    public ResponseEntity <Void> deleteStory(@PathVariable Long id){
        storyService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }
}
