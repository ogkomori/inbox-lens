package com.komori.corefocus.service;

import com.google.api.client.auth.oauth2.*;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePartHeader;
import com.komori.corefocus.config.GmailClientProperties;
import com.komori.corefocus.dto.EmailStats;
import com.komori.corefocus.dto.EmailSummary;
import com.komori.corefocus.dto.GmailMessageParameters;
import com.komori.corefocus.dto.StatsAndEmails;
import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.exception.GmailServiceException;
import com.komori.corefocus.repository.UserRepository;
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
        List<Message> allMessages = fetchAllMessages(GMAIL);
        StatsAndEmails statsAndEmails = getStatsAndEmails(allMessages);
        EmailStats stats = statsAndEmails.stats();
        EmailSummary summary = openAIModelService.sendEmailSummaryPrompt(statsAndEmails.emails());
        emailService.sendSummaryEmail(user.getEmail(), user.getName(), stats, summary);

        log.info("Summary Email sent successfully!");
    }

    private List<Message> fetchAllMessages(Gmail GMAIL) {
        List<Message> shortMessages = new ArrayList<>();
        String pageToken = null;
        do {
            try {
                ListMessagesResponse messagesResponse = GMAIL.users().messages().list("me")
                        .setQ(getDateQuery())
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

    private StatsAndEmails getStatsAndEmails(List<Message> messages) {
        int[] promotions = {0}, updates = {0}, social = {0}, forums = {0}, personal = {0};
        List<GmailMessageParameters> emails = new ArrayList<>();
        messages.forEach(message -> {
            List<String> labelIds = message.getLabelIds();
            if (labelIds.contains("CATEGORY_PRIMARY")) {
                GmailMessageParameters params = GmailMessageParameters.builder()
                        .body(message.getSnippet())
                        .from(getParameter("from", message))
                        .subject(getParameter("subject", message))
                        .time(getTime(message))
                        .build();
                emails.add(params);
            }

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

        EmailStats stats = EmailStats.builder()
                .total(messages.size())
                .personal(personal[0])
                .promotions(promotions[0])
                .updates(updates[0])
                .social(social[0])
                .forums(forums[0]).build();
        return new StatsAndEmails(stats, emails);
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
                .setApplicationName("CoreFocus")
                .build();
    }

    private String getParameter(String parameter, Message m) {
        List<MessagePartHeader> mph = m.getPayload().getHeaders();
        for (MessagePartHeader messagePartHeader : mph) {
            if (messagePartHeader.getName().equalsIgnoreCase(parameter)) {
                return messagePartHeader.getValue();
            }
        }
        return null;
    }

    private String getDateQuery() {
        DateTimeFormatter gmailFormat = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String today = LocalDate.now().format(gmailFormat);
        String yesterday = LocalDate.now().minusDays(1).format(gmailFormat);
        return "label:inbox after:" + yesterday + " before:" + today;
    }

    private String getTime(Message message) {
        long epochMilliseconds = message.getInternalDate();
        Instant instant = Instant.ofEpochMilli(epochMilliseconds);
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return zonedDateTime.format(formatter);
    }
}
