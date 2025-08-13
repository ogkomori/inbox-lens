package com.komori.corefocus.service;

import com.google.api.client.auth.oauth2.*;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePartHeader;
import com.komori.corefocus.config.GmailClientProperties;
import com.komori.corefocus.dto.GmailMessageParams;
import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GmailMessageService {
    private final UserRepository userRepository;
    private final GmailClientProperties gmailClientProperties;
    private final HttpTransport httpTransport;
    private final JsonFactory jsonFactory;
    private final OpenAIModelService openAIModelService;

    public String getLastEmailMessage(String sub) throws IOException {
        Gmail GMAIL = createGmailObjectForUser(sub);

        List<Message> messages = GMAIL.users().messages().list("me").setMaxResults(1L).setQ("label:inbox").execute().getMessages();
        if (!messages.isEmpty()) {
            Message message = messages.getFirst();
            message = GMAIL.users().messages().get("me", message.getId()).execute();

            GmailMessageParams params = GmailMessageParams.builder()
                    .from(getParameter("from", message))
                    .subject(getParameter("subject", message))
                    .date(formatGmailDate(getParameter("date", message)))
                    .body(message.getSnippet())
                    .build();

            return openAIModelService.sendPrompt(params.toString());
        }
        return null;
    }

    private Gmail createGmailObjectForUser(String sub) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        String accessTokenValue = user.getAccessToken();
        String refreshTokenValue = user.getRefreshToken();
        Long expirationTime = user.getAccessTokenExpiresAt().toEpochMilli();

        Credential credential = new Credential.Builder(BearerToken.authorizationHeaderAccessMethod())
                .setRefreshListeners(List.of(new CredentialRefreshListener() {
                    @Override
                    public void onTokenResponse(Credential credential, TokenResponse tokenResponse) {
                        String newAccessToken = credential.getAccessToken();
                        String newRefreshToken = credential.getRefreshToken();
                        Instant newExpiry = Instant.ofEpochMilli(credential.getExpirationTimeMilliseconds());
                        user.setAccessToken(newAccessToken);
                        user.setAccessTokenIssuedAt(Instant.now());
                        user.setAccessTokenExpiresAt(newExpiry);
                        if (newRefreshToken != null) {
                            user.setRefreshToken(newRefreshToken);
                        }
                        userRepository.save(user);
                    }

                    @Override
                    public void onTokenErrorResponse(Credential credential, TokenErrorResponse tokenErrorResponse) {
                        String email = user.getEmail();
                        log.error("Token refresh failed for user with email {}.", email);
                        log.error("Error: {}", tokenErrorResponse.getError());
                        log.error("Description: {}", tokenErrorResponse.getErrorDescription());
                    }
                })) // adds custom refresh listener (to save new tokens after refresh)
                // You might be wondering why this whole logic isn't in a separate class
                // This isn't in a separate class because if it was, we wouldn't be able to access the sub attribute
                // Which is used for identification
                .setJsonFactory(jsonFactory)
                .setTransport(httpTransport)
                .setTokenServerEncodedUrl(gmailClientProperties.getToken_uri()) // token uri
                .setClientAuthentication(new ClientParametersAuthentication(
                        gmailClientProperties.getClient_id(),
                        gmailClientProperties.getClient_secret())
                ) // add clientID and clientSecret
                .build()
                .setAccessToken(accessTokenValue)
                .setRefreshToken(refreshTokenValue)
                .setExpirationTimeMilliseconds(expirationTime);

        return new Gmail(httpTransport, jsonFactory, credential);
    }

    private String getParameter(String parameter, Message m) {
        List<MessagePartHeader> mph = m.getPayload().getHeaders();
        for (MessagePartHeader messagePartHeader : mph) {
            if (messagePartHeader.getName().equalsIgnoreCase(parameter)) {
                return messagePartHeader.getValue();
            }
        }
        return "";
    }

    private LocalDate formatGmailDate(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.RFC_1123_DATE_TIME;
        String cleanedDate = date.replaceAll("\\s*\\([^)]*\\)", "");
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(cleanedDate, formatter);
        return zonedDateTime.toLocalDate();
    }
}
