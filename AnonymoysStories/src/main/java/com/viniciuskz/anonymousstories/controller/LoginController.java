package com.viniciuskz.anonymousstories.controller;

import com.viniciuskz.anonymousstories.entity.User;
import com.viniciuskz.anonymousstories.service.LoginService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/login")
public class LoginController {

        private final LoginService loginService;

        public LoginController(LoginService loginService){
            this.loginService = loginService;
        }

        @PostMapping
    public ResponseEntity<User> login(@RequestBody User user){
            User loggedUser = loginService.login(user);

            return ResponseEntity.ok(loggedUser);
        }
}
