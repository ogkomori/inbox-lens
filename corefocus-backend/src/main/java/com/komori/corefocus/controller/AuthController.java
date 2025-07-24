package com.komori.corefocus.controller;

import com.komori.corefocus.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtUtil jwtUtil;

    @GetMapping("/status")
    public ResponseEntity<?> checkAuthStatus(@CookieValue(name = "jwt", required = false) String jwt) {
        Map<Object, Boolean> response = new HashMap<>();
        if (jwt != null && !jwtUtil.isTokenExpired(jwt)) {
            response.put("loggedIn", true);
            return ResponseEntity.ok(response);
        }
        response.put("loggedIn", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}
