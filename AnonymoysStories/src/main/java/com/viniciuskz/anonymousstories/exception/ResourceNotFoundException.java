package com.viniciuskz.anonymousstories.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message){
        super (message);
    }
}
