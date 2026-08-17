package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public class LoginResponseDTO {

    private Long id;
    private String email;
    private String name;
    private String token;

    public LoginResponseDTO(){}

    public LoginResponseDTO(Long id, String name, String email, String token){
        this.id = id;
        this.email = email;
        this.name = name;
        this.token = token;
    }

    public Long getId(){
        return id;
    }

    public String getEmail(){
        return email;
    }

    public String getName(){
        return name;
    }

    public String getToken(){
        return token;
    }


}
