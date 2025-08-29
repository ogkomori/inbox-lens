package com.komori.inboxlens.service;

import com.komori.inboxlens.dto.Contact;
import com.komori.inboxlens.dto.EmailStats;
import com.komori.inboxlens.dto.EmailSummary;
import com.komori.inboxlens.exception.MailSendingException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MailSendingService {
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;
    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String name) {
        Context context = new Context();
        context.setVariable("username", name);
        String htmlContent = templateEngine.process("welcome-email", context);
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setText(htmlContent, true);
            helper.setSubject("Welcome to InboxLens!");
            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            throw new MailSendingException("Failed to send welcome email", e);
        }
    }

    public void sendSummaryEmail(String toEmail, String name, EmailStats emailStats, EmailSummary summary)  {
        Context context = getContextForSummaryEmail(name, emailStats, summary);
        String htmlContent = templateEngine.process("summary-email", context);
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setText(htmlContent, true);
            helper.setSubject("InboxLens Summary: " + getOrdinalDate(LocalDate.now().minusDays(1)));
            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendContactEmail(Contact contact) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(fromEmail);
        message.setFrom(fromEmail);
        message.setSubject("New Message from " + contact.getEmail());
        message.setText(contact.toString());
        mailSender.send(message);
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
}
