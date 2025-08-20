package com.komori.inboxlens.controller;

import com.komori.inboxlens.dto.CustomResponseBody;
import com.komori.inboxlens.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
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
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(sub);
        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(sub);

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
