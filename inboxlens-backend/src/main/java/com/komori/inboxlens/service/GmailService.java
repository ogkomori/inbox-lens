package com.komori.inboxlens.service;

import com.google.api.client.auth.oauth2.*;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePartHeader;
import com.komori.inboxlens.config.GmailClientProperties;
import com.komori.inboxlens.dto.EmailStats;
import com.komori.inboxlens.dto.EmailSummary;
import com.komori.inboxlens.dto.GmailMessageParameters;
import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.exception.GmailServiceException;
import com.komori.inboxlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GmailService {
    private final UserRepository userRepository;
    private final GmailClientProperties gmailClientProperties;
    private final HttpTransport httpTransport;
    private final JsonFactory jsonFactory;
    private final OpenAIModelService openAIModelService;
    private final EmailService emailService;

    public void getFinalSummary(String sub) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        Gmail GMAIL = createGmailObjectForUser(sub);
        List<Message> allMessages = fetchMessagesForYesterday(GMAIL, "");
        EmailStats stats = getEmailStats(allMessages);
        List<Message> primaryMessages = fetchMessagesForYesterday(GMAIL, "category:primary");
        List<String> primaryStrings = getPrimaryEmailStrings(primaryMessages);
        EmailSummary summary = openAIModelService.sendEmailSummaryPrompt(primaryStrings);
        emailService.sendSummaryEmail(user.getEmail(), user.getName(), stats, summary);

        log.info("Summary Email sent successfully!");
    }

    private List<Message> fetchMessagesForYesterday(Gmail GMAIL, String customQuery) {
        List<Message> shortMessages = new ArrayList<>();
        String pageToken = null;
        do {
            try {
                ListMessagesResponse messagesResponse = GMAIL.users().messages().list("me")
                        .setQ(getDateQuery() + " " + customQuery)
                        .setPageToken(pageToken)
                        .execute();
                List<Message> messages = messagesResponse.getMessages();
                shortMessages.addAll(messages);
                pageToken = messagesResponse.getNextPageToken();
            } catch (IOException e) {
                throw new GmailServiceException("Error fetching messages for the day");
            }
        } while (pageToken != null);

        return shortMessages.stream()
                .map(message -> {
                    try {
                        return GMAIL.users().messages().get("me", message.getId())
                                .setFormat("metadata")
                                .execute();
                    } catch (IOException e) {
                        throw new GmailServiceException("Error fetching individual message: " + message.getId());
                    }
                }).toList();
    }

    private EmailStats getEmailStats(List<Message> messages) {
        int[] promotions = {0}, updates = {0}, social = {0}, forums = {0}, personal = {0};
        messages.forEach(message -> {
            List<String> labelIds = message.getLabelIds();
            if (labelIds.contains("CATEGORY_PROMOTIONS")) {
                promotions[0]++;
            }
            if (labelIds.contains("CATEGORY_UPDATES")) {
                updates[0]++;
            }
            if (labelIds.contains("CATEGORY_SOCIAL")) {
                social[0]++;
            }
            if (labelIds.contains("CATEGORY_FORUMS")) {
                forums[0]++;
            }
            if (labelIds.contains("CATEGORY_PERSONAL")) {
                personal[0]++;
            }
        });

        return EmailStats.builder()
                .total(messages.size())
                .personal(personal[0])
                .promotions(promotions[0])
                .updates(updates[0])
                .social(social[0])
                .forums(forums[0]).build();
    }

    private List<String> getPrimaryEmailStrings(List<Message> primaryMessages) {
        return primaryMessages.stream()
                .map(this::getParameters)
                .map(GmailMessageParameters::toString)
                .toList();
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
                // Which is used for identification of the current user, dyg?
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

        return new Gmail.Builder(httpTransport, jsonFactory, credential)
                .setApplicationName("InboxLens")
                .build();
    }

    private GmailMessageParameters getParameters(Message message) {
        long epochMilliseconds = message.getInternalDate();
        Instant instant = Instant.ofEpochMilli(epochMilliseconds);
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String time = zonedDateTime.format(formatter);
        String from = null, subject = null;

        List<MessagePartHeader> mph = message.getPayload().getHeaders();
        for (MessagePartHeader header : mph) {
            switch (header.getName()) {
                case "From" -> from = header.getValue();
                case "Subject" -> subject = header.getValue();
            }
        }

        return GmailMessageParameters.builder()
                .time(time)
                .from(from)
                .subject(subject)
                .body(message.getSnippet())
                .build();
    }

    private String getDateQuery() {
        DateTimeFormatter gmailFormat = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String today = LocalDate.now().format(gmailFormat);
        String yesterday = LocalDate.now().minusDays(1).format(gmailFormat);
        return "label:inbox after:" + yesterday + " before:" + today;
    }
}
