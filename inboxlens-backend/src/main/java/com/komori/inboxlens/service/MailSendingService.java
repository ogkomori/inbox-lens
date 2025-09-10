package com.komori.inboxlens.service;

import com.komori.inboxlens.dto.Contact;
import com.komori.inboxlens.dto.EmailRequest;
import com.komori.inboxlens.dto.EmailStats;
import com.komori.inboxlens.dto.EmailSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MailSendingService {
    @Value("${brevo.from-email}")
    private String fromEmail;
    @Value("${brevo.api-key}")
    private String apiKey;
    private final SpringTemplateEngine templateEngine;
    private final RestTemplate restTemplate;

    public void sendWelcomeEmail(String toEmail, String name) {
        Context context = new Context();
        context.setVariable("username", name);
        String htmlContent = templateEngine.process("welcome-email", context);

        sendEmail("Welcome to InboxLens!", htmlContent, name, toEmail);
    }

    public void sendSummaryEmail(String toEmail, String name, EmailStats emailStats, EmailSummary summary)  {
        Context context = getContextForSummaryEmail(name, emailStats, summary);
        String htmlContent = templateEngine.process("summary-email", context);

        sendEmail("InboxLens Summary: " + getOrdinalDate(LocalDate.now().minusDays(1)), htmlContent, name ,toEmail);
    }

    public void sendContactEmail(Contact contact) {
        sendEmail("New Message from " + contact.getEmail(), contact.toString(), "Me", "majorogkomori@gmail.com");
    }

    private Context getContextForSummaryEmail(String name, EmailStats emailStats, EmailSummary summary) {
        Context context = new Context();
        context.setVariable("username", name);
        context.setVariable("total_emails", emailStats.getTotal());
        context.setVariable("promotions", emailStats.getPromotions());
        context.setVariable("social", emailStats.getSocial());
        context.setVariable("personal", emailStats.getPersonal());
        context.setVariable("forums", emailStats.getForums());
        context.setVariable("updates", emailStats.getUpdates());
        context.setVariable("smartInsight", summary.getSmartInsight());
        context.setVariable("shortSummary", summary.getShortSummary());
        context.setVariable("actionableEmails", summary.getActionableEmailList());
        context.setVariable("importantInfoEmails", summary.getImportantInformationList());
        return context;
    }

    private String getOrdinalDate(LocalDate localDate) {
        String month = localDate.getMonth().toString();
        int day = localDate.getDayOfMonth();
        String ordinal = "th";
        if (day == 1 || day == 21 || day == 31) {
            ordinal = "st";
        }
        else if (day == 2 || day == 22) {
            ordinal = "nd";
        }
        else if (day == 3 || day == 23) {
            ordinal = "rd";
        }
        return day + ordinal + " " + month.charAt(0) + month.substring(1).toLowerCase();
    }

    private void sendEmail(String subject, String htmlContent, String name, String toEmail) {
        EmailRequest request = EmailRequest.builder()
                .to(List.of(new EmailRequest.NameAndEmail(name, toEmail)))
                .sender(new EmailRequest.NameAndEmail("InboxLens", fromEmail))
                .subject(subject)
                .htmlContent(htmlContent)
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);
        HttpEntity<EmailRequest> httpEntity = new HttpEntity<>(request, headers);

        ResponseEntity<?> response = restTemplate.postForEntity(
                "https://api.brevo.com/v3/smtp/email",
                httpEntity,
                Object.class
        );

        if (response.getStatusCode().isError()) {
            throw new MailSendException("Welcome mail not sent: " + response.getBody());
        }
    }
}
