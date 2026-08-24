package com.viniciuskz.anonymousstories.dto;

import org.springframework.http.HttpStatus;


    public record RestErrorMessage(
            int Status,
            String error,
            String message
    ){
        public RestErrorMessage(HttpStatus status, String message){
            this(status.value(), status.getReasonPhrase(), message);
        }
    }

