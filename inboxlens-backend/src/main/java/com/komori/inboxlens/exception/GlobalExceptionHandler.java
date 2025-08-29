package com.komori.inboxlens.exception;

import com.komori.inboxlens.dto.CustomResponseBody;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({UsernameNotFoundException.class, UnauthorizedException.class, JwtException.class})
    public ResponseEntity<Object> handleGeneralUnauthorized(Exception e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, e);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception e) {
        log.error("Unexpected error occurred: {}", e.getMessage());
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, e);
    }

    private ResponseEntity<Object> buildResponse(HttpStatus status, Exception e) {
        return ResponseEntity.status(status)
                .body(new CustomResponseBody(
                        LocalDateTime.now(),
                        status.value(),
                        status.getReasonPhrase(),
                        e.getMessage()
                ));
    }
}
