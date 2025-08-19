package com.komori.corefocus.security;

import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.repository.UserRepository;
import com.komori.corefocus.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String sub = authentication.getName();
        ResponseCookie accessCookie = jwtUtil.createAccessTokenCookie(sub);
        ResponseCookie refreshCookie = jwtUtil.createRefreshTokenCookie(sub);

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        OAuth2User oAuth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();
        Optional<UserEntity> user = userRepository.findBySub(sub);
        if (user.isEmpty()) {
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("given_name");

            emailService.sendWelcomeEmail(email, name);
            UserEntity newUser = UserEntity.builder()
                    .email(email)
                    .sub(sub)
                    .name(name)
                    .build();
            userRepository.save(newUser);

            response.sendRedirect("http://localhost:5173/preferred-time");
        }
        else {
            if (user.get().getPreferredTime() == null) {
                response.sendRedirect("http://localhost:5173/preferred-time");
            }
            else {
                response.sendRedirect("http://localhost:5173/dashboard");
            }
        }
    }
}
