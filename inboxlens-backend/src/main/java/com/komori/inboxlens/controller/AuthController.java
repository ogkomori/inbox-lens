package com.komori.inboxlens.controller;

import com.komori.inboxlens.exception.UnauthorizedException;
import com.komori.inboxlens.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtUtil jwtUtil;

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie refreshCookie = ResponseCookie.from("refresh")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("access")
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
                .body("Logout successful");
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(@CookieValue(name = "access", required = false) String accessToken,
                                     @CookieValue(name = "refresh", required = false) String refreshToken) {

        if (refreshToken == null && accessToken == null) {
            throw new UnauthorizedException("No access/refresh tokens found");
        }

        if (refreshToken == null && jwtUtil.isTokenExpired(accessToken)) {
            throw new UnauthorizedException("No refresh token found");
        }

        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new UnauthorizedException("Refresh token expired");
        }

        String sub = jwtUtil.extractSubFromToken(refreshToken);
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(sub);
        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(sub);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body("Refresh successful");
    }
}
