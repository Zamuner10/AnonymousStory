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
    @Size(min=30, max=700)
    @Column(nullable = false, columnDefinition="TEXT")
    private String content;

    
    @Column(nullable = false, name="created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean anonymous =true;

    public Story(){}
    public Story(Long id, String title, String content, LocalDateTime createdAt, User user, boolean anonymous){
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.user = user;
        this.anonymous = anonymous;
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

    public void setAnonymous(boolean anonymous){this.anonymous = anonymous;}
    public Boolean isAnonymous(){return anonymous;}

}
