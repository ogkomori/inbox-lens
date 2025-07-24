package com.komori.corefocus.service;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final UserRepository userRepository;

    private Gmail loadTokens(@CurrentSecurityContext(expression = "authentication?.name") String sub) {
        UserEntity currentUser = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Credential.AccessMethod accessMethod = BearerToken.authorizationHeaderAccessMethod();
        Credential credential = new Credential(accessMethod);
        credential.setAccessToken(currentUser.getAccessToken());
        credential.setRefreshToken(currentUser.getRefreshToken());
        credential.setExpirationTimeMilliseconds(currentUser.getAccessTokenExpiresAt().toEpochMilli());

        return new Gmail(new NetHttpTransport(), GsonFactory.getDefaultInstance(), credential);
    }
}
