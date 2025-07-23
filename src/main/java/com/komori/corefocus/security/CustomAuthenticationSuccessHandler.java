package com.komori.corefocus.security;

import com.komori.corefocus.service.AuthorizedClientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final AuthorizedClientService clientService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        System.out.println("Authentication success");
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;

        OAuth2AuthorizedClient client = clientService
                .loadAuthorizedClient(token.getAuthorizedClientRegistrationId(), token.getName());

        String access = client.getAccessToken().getTokenValue();
        String refresh = (client.getRefreshToken() != null) ? client.getRefreshToken().getTokenValue() : null;

        System.out.println("Access: " + access);
        System.out.println("Refresh: " + refresh);

        response.sendRedirect("/profile");
    }
}
