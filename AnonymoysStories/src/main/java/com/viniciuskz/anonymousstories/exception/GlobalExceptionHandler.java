package com.viniciuskz.anonymousstories.exception;


import com.viniciuskz.anonymousstories.dto.RestErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestErrorMessage> handlValidationExceptions(MethodArgumentNotValidException ex){
        String fieldError = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        RestErrorMessage error = new RestErrorMessage(HttpStatus.BAD_REQUEST, fieldError);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<RestErrorMessage> handleBadCredentials(BadCredentialsException ex){
        RestErrorMessage error = new RestErrorMessage(HttpStatus.UNAUTHORIZED, "Invalid email and password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestErrorMessage> handleGeneralException(Exception e) {
        e.printStackTrace(); //linha temporariamente!
        RestErrorMessage threatResponse = new RestErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR, "An internal server error occurred.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(threatResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity <RestErrorMessage> handleIllegalArgumentException (IllegalArgumentException ex ){
        RestErrorMessage error = new RestErrorMessage(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
