package com.viniciuskz.anonymousstories.repository;

import com.viniciuskz.anonymousstories.entity.Story;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByUserId (Long userId);
    List<Story> findAllByOrderByCreatedAtDesc();


    //@Query() <- Banco de dados ! implementação depois !
    //List<Story> findAllRandom();
}
