package com.viniciuskz.anonymousstories.exception;

public class UserNotVerifiedException extends  RuntimeException{
    public UserNotVerifiedException(String message){
        super(message);
    }
}
