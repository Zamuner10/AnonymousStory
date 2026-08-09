package com.viniciuskz.anonymousstories.service;

import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginService (UserRepository userRepository, PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User login(User user){

        Optional<User> loginUser = userRepository.findByEmail(user.getEmail());

        if(loginUser.isEmpty()){
            throw new IllegalArgumentException("Email doesn't exist.");
        }
        if (!passwordEncoder.matches(user.getPassword(), loginUser.get().getPassword())){
            throw new IllegalArgumentException("Password incorrect.");
        }
        return loginUser.get();
    }
}