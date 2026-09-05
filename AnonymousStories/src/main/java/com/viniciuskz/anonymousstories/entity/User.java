package com.viniciuskz.anonymousstories.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")

public class User implements UserDetails
{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 8)
    @Column(nullable = false)
    private String password;
    
    @NotNull
    @Min(13)
    @Column(nullable = false)
    private Integer age;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    private String passwordResetToken;
    private LocalDateTime passwordResetTokenExpiry;


    public User(Long id, String name, String email, String password, Integer age, String verificationToken, Boolean isVerified, String passwordResetToken, LocalDateTime passwordResetTokenExpiry) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.age = age;
        this.verificationToken = verificationToken;
        this.isVerified = isVerified;
        this.passwordResetToken = passwordResetToken;
        this.passwordResetTokenExpiry = passwordResetTokenExpiry;
    }

    public User (){}
    
    public void setId(Long id){
        this.id = id;
    }
    public Long getId(){
        return id;
    }

    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return name;
    }

    public void setEmail(String email){
        this.email = email;
    }
    public String getEmail(){
        return email;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }
    public String getVerificationToken() {
        return verificationToken;
    }

    public void setIsVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }
    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setPasswordResetToken(String passwordResetToken){ this.passwordResetToken = passwordResetToken; }
    public String getPasswordResetToken () {return passwordResetToken;}

    public void setPasswordResetTokenExpiry(LocalDateTime passwordResetTokenExpiry){this.passwordResetTokenExpiry = passwordResetTokenExpiry;}
    public LocalDateTime getPasswordResetTokenExpiry() {return passwordResetTokenExpiry;}

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return this.isVerified;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
    public Integer getAge() {
        return age;
    }
    
}
