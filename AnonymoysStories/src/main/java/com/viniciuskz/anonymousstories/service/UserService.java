package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.UserRepository;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    
    public UserService (UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User createUser( User user){
    
        validateEmailAlreadyExist(user.getEmail());
        validateName(user.getName());
        validatePassword(user.getPassword());

        return userRepository.save(user);
    }

    private void validateEmailAlreadyExist(String email){
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()){
            throw new IllegalArgumentException("The email address is registered.");
        }
    }

    private void validateName(String name){
        char firstLetter = name.charAt(0);
    
        if (!Character.isUpperCase(firstLetter) ){
            throw new IllegalArgumentException("The first letter must be capitalized.");
        }

        for (int i = 0; i <name.length(); i++){
            char ch = name.charAt(i);

            if (Character.isDigit(ch)){
                throw new IllegalArgumentException("The name cannot contain numbers.");
            }

            if (!Character.isLetter(ch) && !Character.isWhitespace(ch)){
                throw new IllegalArgumentException("The name cannot contain special characters.");
            }
        }
    }

    private void validatePassword(String password){
        
        boolean hasLetter = false;
        boolean hasUpperCase = false;
        boolean hasDigit = false;
        boolean hasSpecialChar = false;

        for (int i = 0; i < password.length(); i++){
            char ch = password.charAt(i);

            if (Character.isLetter(ch)){
                hasLetter = true;
            }

            if (Character.isUpperCase(ch)){
                hasUpperCase = true;
            }

            if (Character.isDigit(ch)){
                hasDigit = true;
            }
            
            if (!Character.isLetterOrDigit(ch) && !Character.isWhitespace(ch)){
                hasSpecialChar = true;
            }
        }
            if (!hasLetter) {
                throw new IllegalArgumentException("Password must contain at least one letter.");
            }
            if (!hasUpperCase) {
                throw new IllegalArgumentException("Password must contain at least one uppercase letter.");
            }
            if (!hasDigit) {
                throw new IllegalArgumentException("Password must contain at least one number.");
            }
            if (!hasSpecialChar) {
                throw new IllegalArgumentException("Password must contain at least one special character.");
            }
            }
}
