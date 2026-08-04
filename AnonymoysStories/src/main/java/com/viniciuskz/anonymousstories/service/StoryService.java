package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.entity.Story;
import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.StoryRepository;
import com.viniciuskz.anonymousstories.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;


    public StoryService(StoryRepository storyRepository, UserRepository userRepository) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }

    public Story createStory(Long userId, Story story){

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("\r\n" + "User not found with ID: " + userId));

        //validateitle(story.getTitle());
        //validateContent(story.getContent());
        //validatedUser(story.getUser());

        story.setUser(user);
        story.setCreatedAt(LocalDateTime.now());

        return storyRepository.save(story);
    }

    public Story findById(Long id) {
        return storyRepository.findById(id).orElseThrow(() -> new RuntimeException("Story not found with ID: " + id));
    }


//    public List<Story> findRandomStory(){
//        return storyRepository.findAll();
//    }

    public void deleteStory(Long id){
        if(!storyRepository.existsById(id)){
            throw new RuntimeException("History not found for deletion with ID: " + id);
        }
        storyRepository.deleteById(id);
    }



    //private void validateTitle(String title){}
    //private void validateContent(String content){}
    //private void validateUser (User user){}
}
