package com.komori.inboxlens.controller;

import com.komori.inboxlens.config.AppProperties;
import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.exception.UnauthorizedException;
import com.komori.inboxlens.repository.UserRepository;
import com.komori.inboxlens.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtUtil jwtUtil;
    private final RestTemplateBuilder restTemplateBuilder;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    @SuppressWarnings("rawtypes")
    @GetMapping("/login")
    public void login(@RequestHeader(name = "X-Auth-Request-Access-Token") String accessToken,
                      @RequestHeader(name = "X-Auth-Request-User") String sub,
                      HttpServletResponse response) throws IOException {

        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(sub);
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(sub);
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        Optional<UserEntity> user = userRepository.findBySub(sub);

        if (user.isEmpty()) { // registering
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = restTemplateBuilder.build();
            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    "https://openidconnect.googleapis.com/v1/userinfo",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Map<String, Object> userInfo = userInfoResponse.getBody();
            if (userInfo == null) {
                response.sendRedirect(appProperties.getFrontendUrl());
                return;
            }

            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("given_name");
            UserEntity newUser = UserEntity.builder()
                    .email(email)
                    .name(name)
                    .sub(sub)
                    .build();
            userRepository.save(newUser);
            response.sendRedirect(appProperties.getFrontendUrl() + "/preferences");
        } else { // logging in
            response.sendRedirect(appProperties.getFrontendUrl() + "/dashboard");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie refreshCookie = ResponseCookie.from("refresh")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .domain(".inboxlens.app")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("access")
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .domain(".inboxlens.app")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body("Logout successful");
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(@CookieValue(name = "refresh", required = false) String refreshToken) {

        if (refreshToken == null) {
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
