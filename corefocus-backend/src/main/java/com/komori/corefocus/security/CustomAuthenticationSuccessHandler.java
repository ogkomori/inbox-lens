package com.komori.corefocus.security;

import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.repository.UserRepository;
import com.komori.corefocus.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String accessToken = jwtUtil.generateAccessToken(authentication.getName());
        String refreshToken = jwtUtil.generateRefreshToken(authentication.getName());

        Cookie accessTokenCookie = new Cookie("jwt", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(60 * 15); // 15 minutes
        accessTokenCookie.setSecure(request.isSecure()); // Use request.isSecure() for flexibility

        Cookie refreshTokenCookie = new Cookie("refresh", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 14); // 14 days
        refreshTokenCookie.setSecure(request.isSecure());

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        UserEntity user = userRepository.findBySub(authentication.getName())
                        .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        if (user.getPreferredTime() == null) {
            response.sendRedirect("http://localhost:5173/preferred-time");
        }
        else {
            response.sendRedirect("http://localhost:5173/dashboard");
        }
    }
}
