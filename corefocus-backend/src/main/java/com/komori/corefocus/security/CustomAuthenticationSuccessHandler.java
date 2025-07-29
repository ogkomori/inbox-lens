package com.komori.corefocus.security;

import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.repository.UserRepository;
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
import java.time.Duration;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String accessToken = jwtUtil.generateAccessToken(authentication.getName());
        String refreshToken = jwtUtil.generateRefreshToken(authentication.getName());

        ResponseCookie accessCookie = ResponseCookie.from("jwt", accessToken)
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofMinutes(1))
                .sameSite("None")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh", refreshToken)
                .httpOnly(true)
                .path("/")
                .secure(true)
                .maxAge(Duration.ofDays(14))
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        OAuth2User oAuth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();
        Optional<UserEntity> user = userRepository.findBySub(authentication.getName());
        if (user.isEmpty()) {
            UserEntity newUser = UserEntity.builder()
                    .email(oAuth2User.getAttribute("email"))
                    .sub(authentication.getName())
                    .name(oAuth2User.getAttribute("given_name"))
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
