package com.viniciuskz.anonymousstories.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class ModerationServiceException extends RuntimeException {
    public ModerationServiceException(String message){
        super (message);
    }

    public ModerationServiceException(String message, Throwable cause){
        super (message, cause);
    }
}
