package com.viniciuskz.anonymousstories.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;


@Entity
@Table(name="stories")
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min=5, max=80)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Size(min=30, max=500)
    @Column(nullable = false, columnDefinition="TEXT")
    private String content;

    
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Story(){}
    public Story(Long id, String title, String content, LocalDateTime createdAt, User user){
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.user = user;
    }

    public void setId(Long id){
        this.id = id;
    }
    public Long getId(){
        return id;
    }

    public void setTitle (String title){
        this.title = title;
    }
    public String getTitle (){
        return title;
    }

    public void setContent(String content){
        this.content = content;
    }
    public String getContent(){
        return content;
    }

    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt = createdAt;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    @PrePersist
    public void prePersist(){this.createdAt = LocalDateTime.now();}

    public void setUser(User user){
        this.user = user;
    }
    public User getUser(){
        return user;
    }

}
