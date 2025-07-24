package com.komori.corefocus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;
    private JavaMailSender javaMailSender;

    public void sendSummaryEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        // add Mail details
        javaMailSender.send(message);
    }
}
