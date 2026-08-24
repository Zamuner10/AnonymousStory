package com.viniciuskz.anonymousstories.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ContentModerationException extends RuntimeException {
    public ContentModerationException(String message) {
        super(message);
    }
}
