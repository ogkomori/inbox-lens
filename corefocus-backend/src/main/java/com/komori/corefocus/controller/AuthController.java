package com.komori.corefocus.controller;

import com.komori.corefocus.dto.CustomResponseBody;
import com.komori.corefocus.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtUtil jwtUtil;

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie refreshCookie = ResponseCookie.from("refresh")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("jwt")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new CustomResponseBody(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Logout successful",
                        true
                ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "jwt", required = false) String accessToken,
                                     @CookieValue(name = "refresh", required = false) String refreshToken) {

        System.out.println("Attempting refresh");
        if (refreshToken == null && accessToken == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new CustomResponseBody(
                            LocalDateTime.now(),
                            HttpStatus.UNAUTHORIZED.value(),
                            "User is not logged in",
                            false
                    ));
        }

        if (refreshToken == null && jwtUtil.isTokenExpired(accessToken)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new CustomResponseBody(
                            LocalDateTime.now(),
                            HttpStatus.UNAUTHORIZED.value(),
                            "No refresh token found",
                            false
                    ));
        }

        if (jwtUtil.isTokenExpired(refreshToken)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new CustomResponseBody(
                            LocalDateTime.now(),
                            HttpStatus.UNAUTHORIZED.value(),
                            "Refresh token expired",
                            false
                    ));
        }

        String sub = jwtUtil.extractSubFromToken(refreshToken);
        ResponseCookie refreshCookie = ResponseCookie.from("refresh", jwtUtil.generateRefreshToken(sub))
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofDays(14))
                .sameSite("None")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("jwt", jwtUtil.generateAccessToken(sub))
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofMinutes(1))
                .sameSite("None")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new CustomResponseBody(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Refresh successful",
                        true
                ));
    }
}
