package com.komori.inboxlens.exception;

import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> usernameNotFound(UsernameNotFoundException e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, e);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Object> jwtException(JwtException e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, e);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception e) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, e);
    }

    private ResponseEntity<Object> buildResponse(HttpStatus status, Exception e) {
        log.error("Unexpected error occurred", e);
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", e.getMessage());
        return ResponseEntity.status(status).body(body);
    }
}
