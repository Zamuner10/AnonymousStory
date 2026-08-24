package com.viniciuskz.anonymousstories.exception;

import com.viniciuskz.anonymousstories.dto.RestErrorMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

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

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RestErrorMessage> handleIllegalArgumentException (IllegalArgumentException ex ){
        RestErrorMessage error = new RestErrorMessage(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<RestErrorMessage> handleResourceNotFoundException(ResourceNotFoundException ex){
        RestErrorMessage error = new RestErrorMessage(HttpStatus.NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(ContentModerationException.class)
    public ResponseEntity<RestErrorMessage> handleContentModerationException(ContentModerationException ex){
        RestErrorMessage error = new RestErrorMessage(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<StandardError> handleAccessDenied(AccessDeniedException e, HttpServletRequest request){
        HttpStatus status = HttpStatus.FORBIDDEN;
        StandardError err = new StandardError (
                System.currentTimeMillis(),
                status.value(),
                "Access Invalid",
                e.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(ModerationServiceException.class)
    public ResponseEntity<StandardError> handleModerationServiceException (ModerationServiceException e, HttpServletRequest request){
        HttpStatus status = HttpStatus.SERVICE_UNAVAILABLE;
        StandardError err = new StandardError (
                System.currentTimeMillis(),
                status.value(),
                "Moderation Service Unavailable",
                e.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(UserNotVerifiedException.class)
    public ResponseEntity<RestErrorMessage> handleUserNotVerified(UserNotVerifiedException ex){
        RestErrorMessage error = new RestErrorMessage(HttpStatus.FORBIDDEN, ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestErrorMessage> handleGeneralException(Exception e) {
        e.printStackTrace();
        RestErrorMessage threatResponse = new RestErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR, "An internal server error occurred.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(threatResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public  ResponseEntity<Map<String, String>> handleConstraintViolationException (ConstraintViolationException ex){
        Map<String, String> errors = new HashMap<>();

        ex.getConstraintViolations().forEach(violation->{
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            errors.put(propertyPath, message);
        });

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<RestErrorMessage> handleDisabledException(DisabledException ex) {
        RestErrorMessage error = new RestErrorMessage(
                HttpStatus.FORBIDDEN,
                "Account not verified. Please check your email to verify your account before logging in."
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
}