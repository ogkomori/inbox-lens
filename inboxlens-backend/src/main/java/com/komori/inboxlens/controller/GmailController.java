package com.komori.inboxlens.controller;

import com.komori.inboxlens.config.GmailClientProperties;
import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@SuppressWarnings("rawtypes")
@Slf4j
@RestController
@RequestMapping("/api/gmail")
@RequiredArgsConstructor
public class GmailController {
    private final UserRepository userRepository;
    private final GmailClientProperties clientProperties;
    private final RestTemplateBuilder restTemplateBuilder;

    @GetMapping("/auth-url")
    public void sendToAuthUrl(HttpServletResponse response) throws IOException {
        String url = UriComponentsBuilder.fromUriString(clientProperties.getAuth_uri())
                .queryParam("client_id", clientProperties.getClient_id())
                .queryParam("redirect_uri", clientProperties.getRedirect_uri())
                .queryParam("response_type", "code")
                .queryParam("scope", clientProperties.getScope())
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent")
                .build().toUriString();

        response.sendRedirect(url);
    }

    @GetMapping("/oauth2/callback")
    public void handleCallback(@RequestParam(name = "code") String code,
                               @CurrentSecurityContext(expression = "authentication?.name") String sub,
                               HttpServletResponse servletResponse) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", clientProperties.getClient_id());
        body.add("client_secret", clientProperties.getClient_secret());
        body.add("redirect_uri", clientProperties.getRedirect_uri());
        body.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String,String>> request = new HttpEntity<>(body, headers);
        RestTemplate template = restTemplateBuilder.build();
        ResponseEntity<Map> response = template.postForEntity(
                clientProperties.getToken_uri(),
                request,
                Map.class
        );

        if (response.getBody() != null && response.getBody().get("scope").equals(clientProperties.getScope())) {
            String accessToken = (String) response.getBody().get("access_token");
            String refreshToken = (String) response.getBody().get("refresh_token");
            Integer expiresIn = (Integer) response.getBody().get("expires_in");

            UserEntity user = userRepository.findBySub(sub)
                    .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));
            user.setAccessToken(accessToken);
            user.setAccessTokenIssuedAt(Instant.now());
            user.setAccessTokenExpiresAt(Instant.now().plusSeconds(expiresIn));
            user.setRefreshToken(refreshToken);
            user.setRefreshTokenIssuedAt(Instant.now());
            user.setInboxAccessGranted(true);

            userRepository.save(user);
        }

        String dashboardUrl = "http://localhost:5173/dashboard";
        servletResponse.sendRedirect(dashboardUrl);
    }

    @PostMapping("/token/refresh")
    public String refresh(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientProperties.getClient_id());
        body.add("client_secret", clientProperties.getClient_secret());
        body.add("refresh_token", refreshToken);
        body.add("grant_type", "refresh_token");

        HttpEntity<MultiValueMap<String,String>> request = new HttpEntity<>(body, headers);

        RestTemplate template = restTemplateBuilder.build();

        ResponseEntity<Map> response = template.postForEntity(
                clientProperties.getToken_uri(),
                request,
                Map.class
        );

        if (response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        }

        return null;
    }

    @GetMapping("/inbox-access-granted")
    public ResponseEntity<Boolean> inboxAccessGranted(@CurrentSecurityContext(expression = "authentication?.name") String sub) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        return ResponseEntity.ok(user.getInboxAccessGranted());
    }
}
