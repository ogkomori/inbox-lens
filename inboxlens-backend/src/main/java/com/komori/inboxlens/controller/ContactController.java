package com.komori.inboxlens.controller;

import com.komori.inboxlens.dto.Contact;
import com.komori.inboxlens.service.MailSendingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
    private final MailSendingService mailSendingService;

    @PostMapping("/send")
    public ResponseEntity<String> sendContactMail(@RequestBody Contact contact) {
        mailSendingService.sendContactEmail(contact);
        return ResponseEntity.ok("Contact mail sent!");
    }
}
