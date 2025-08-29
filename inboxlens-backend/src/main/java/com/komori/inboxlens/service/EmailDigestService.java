package com.komori.inboxlens.service;

import com.google.api.services.gmail.Gmail;
import com.komori.inboxlens.dto.EmailStats;
import com.komori.inboxlens.dto.EmailSummary;
import com.komori.inboxlens.dto.Preferences;
import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.exception.GmailServiceException;
import com.komori.inboxlens.exception.MailSendingException;
import com.komori.inboxlens.exception.OpenAIException;
import com.komori.inboxlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailDigestService {
    private final MailSendingService mailSendingService;
    private final GmailService gmailService;
    private final OpenAIModelService openAIModelService;
    private final UserRepository userRepository;

    @Async("emailProcessingExecutor")
    public CompletableFuture<Void> processUserEmails(String sub) {
        UserEntity user = userRepository.findBySub(sub)
                        .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        log.info("Starting processing for user: {}", sub);

        Preferences userPreferences = Preferences.builder()
                .userCategory(user.getUserCategory())
                .emailTypes(user.getEmailTypes())
                .industries(user.getIndustries())
                .build();

        Gmail gmail = gmailService.createGmailObjectForUser(sub);
        List<String> emails = fetchEmailsWithRetry(gmail, sub);
        EmailSummary summary = processEmailsWithRetry(userPreferences, emails, sub);
        EmailStats stats = fetchStatsWithRetry(gmail, sub);
        sendDigestEmailWithRetry(
                user.getEmail(),
                user.getName(),
                stats,
                summary
        );
        log.info("Completed processing for user: {}", sub);
        int digests = user.getDigests();
        user.setDigests(digests + 1);
        userRepository.save(user);
        return CompletableFuture.completedFuture(null);
    }

    @Retryable(
            retryFor = {GmailServiceException.class},
            backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public List<String> fetchEmailsWithRetry(Gmail gmail, String sub) {
        try {
            return gmailService.fetchPrimaryEmailsForUser(gmail);
        } catch (Exception e) {
            throw new GmailServiceException("Failed to get emails for user:" + sub + ". Retrying...", e);
        }
    }

    @Retryable(
            retryFor = {GmailServiceException.class},
            backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public EmailStats fetchStatsWithRetry(Gmail gmail, String sub) {
        try {
            return gmailService.fetchEmailStats(gmail);
        } catch (Exception e) {
            throw new GmailServiceException("Failed to get emails for user:" + sub + ". Retrying...", e);
        }
    }

    @Retryable(
            retryFor = {OpenAIException.class},
            maxAttempts = 4,
            backoff = @Backoff(delay = 1000, multiplier = 2.0)
    )
    public EmailSummary processEmailsWithRetry(Preferences preferences, List<String> emails, String sub) {
        try {
            return openAIModelService.sendEmailSummaryPrompt(preferences, emails);
        } catch (Exception e) {
            throw new OpenAIException("Failed to process emails for user: " + sub + ". Retrying...", e);
        }
    }

    @Retryable(
            retryFor = {RuntimeException.class},
            backoff = @Backoff(delay = 2000, multiplier = 2.0)
    )
    public void sendDigestEmailWithRetry(String toEmail, String name, EmailStats stats, EmailSummary summary) {
        try {
            mailSendingService.sendSummaryEmail(toEmail, name, stats, summary);
        } catch (Exception e) {
            throw new MailSendingException("Error sending email for email: " + toEmail + ". Retrying...", e);
        }
    }

    // Recovery methods are called when all retries have been exhausted
    @Recover
    private List<String> recoverFromGmailFailure(GmailServiceException e, Gmail gmail, String sub) {
        log.error("Gmail API completely failed for user: {}, using empty email list", sub, e);
        // Could notify admin, store for manual retry, etc.
        return new ArrayList<>();
    }

    @Recover
    private EmailSummary recoverFromLLMFailure(OpenAIException e, List<String> emails, String sub) {
        log.error("LLM classification completely failed for user: {}, using fallback", sub, e);
        // Use rule-based fallback classification
        return createFallbackSummary(emails);
    }

    @Recover
    private void recoverFromEmailSendingFailure(MailSendingException e, String toEmail, String name, EmailStats stats, EmailSummary summary) {
        log.error("Email sending completely failed for email: {}", toEmail, e);
        // Store digest for manual retry later
        // Maybe send to dead letter queue
    }

    private EmailSummary createFallbackSummary(List<String> emails) {
        // Simple rule-based classification when LLM fails
        return EmailSummary.builder()
                .actionableEmailList(new ArrayList<>())
                .importantInformationList(new ArrayList<>())
                .smartInsight("No insights for today")
                .shortSummary("Internal errors mean this email could not be formatted properly.")
                .build();
    }
}
