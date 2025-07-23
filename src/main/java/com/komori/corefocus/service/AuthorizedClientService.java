package com.komori.corefocus.service;

import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthorizedClientService implements OAuth2AuthorizedClientService {
    private final UserRepository userRepository;
    private final ClientRegistrationRepository clientRegistrationRepository;

    @SuppressWarnings("unchecked")
    @Override
    public <T extends OAuth2AuthorizedClient> T loadAuthorizedClient(String clientRegistrationId, String principalName) {
        Assert.hasText(clientRegistrationId, "clientRegistrationId cannot be empty");
        Assert.hasText(principalName, "principalName cannot be empty");

        UserEntity user = userRepository.findBySub(principalName)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        ClientRegistration registration = clientRegistrationRepository.findByRegistrationId(clientRegistrationId);

        OAuth2AccessToken accessToken = new OAuth2AccessToken(
                OAuth2AccessToken.TokenType.BEARER,
                user.getAccessToken(),
                user.getAccessTokenIssuedAt(),
                user.getAccessTokenExpiresAt()
        );

        if (user.getRefreshToken() != null) {
            OAuth2RefreshToken refreshToken = new OAuth2RefreshToken(
                    user.getRefreshToken(),
                    user.getRefreshTokenIssuedAt(),
                    user.getRefreshTokenExpiresAt()
            );

            return (T) new OAuth2AuthorizedClient(
                    ClientRegistration.withClientRegistration(registration).build(),
                    principalName,
                    accessToken,
                    refreshToken
            );
        }

        return (T) new OAuth2AuthorizedClient(
                ClientRegistration.withClientRegistration(registration).build(),
                principalName,
                accessToken,
                null
        );

    }

    @Override
    public void saveAuthorizedClient(OAuth2AuthorizedClient authorizedClient, Authentication principal) {
        System.out.println("SaveAuthorizedClient started");

        Assert.notNull(authorizedClient, "authorizedClient cannot be null"); // Can throw Illegal Argument Exception
        Assert.notNull(principal, "principal cannot be null");

        String principalName = principal.getName();
        Optional<UserEntity> user = userRepository.findBySub(principalName);

        OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
        OAuth2RefreshToken refreshToken = authorizedClient.getRefreshToken();

        UserEntity newUser;
        if (user.isEmpty()) {
            UserEntity.UserEntityBuilder builder = UserEntity.builder()
                    .sub(principalName)
                    .accessToken(accessToken.getTokenValue())
                    .accessTokenIssuedAt(accessToken.getIssuedAt())
                    .accessTokenExpiresAt(accessToken.getExpiresAt());

            if (refreshToken != null && refreshToken.getTokenValue() != null) {
                builder
                        .refreshToken(refreshToken.getTokenValue())
                        .refreshTokenIssuedAt(refreshToken.getIssuedAt())
                        .refreshTokenExpiresAt(refreshToken.getExpiresAt());
            }

            newUser = builder.build();
        }
        else {
            newUser = user.get();
            newUser.setAccessToken(accessToken.getTokenValue());
            newUser.setAccessTokenIssuedAt(accessToken.getIssuedAt());
            newUser.setAccessTokenExpiresAt(accessToken.getExpiresAt());

            if (refreshToken != null && refreshToken.getTokenValue() != null) {
                newUser.setRefreshToken(refreshToken.getTokenValue());
                newUser.setRefreshTokenIssuedAt(refreshToken.getIssuedAt());
                newUser.setRefreshTokenExpiresAt(refreshToken.getExpiresAt());
            }

        }

        userRepository.save(newUser);
    }

    @Override
    public void removeAuthorizedClient(String clientRegistrationId, String principalName) {
        Assert.hasText(clientRegistrationId, "clientRegistrationId cannot be empty");
        Assert.hasText(principalName, "principalName cannot be empty");

        UserEntity user = userRepository.findBySub(principalName)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        user.setAccessToken(null);
        user.setAccessTokenIssuedAt(null);
        user.setAccessTokenExpiresAt(null);
        user.setRefreshToken(null);
        user.setRefreshTokenIssuedAt(null);
        user.setRefreshTokenExpiresAt(null);

        userRepository.save(user);
    }
}
