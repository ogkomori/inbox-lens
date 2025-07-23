package com.komori.corefocus.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ProfileController {
    @RequestMapping(value = "/profile", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal OAuth2User user) {
         String html = "<h1> Welcome, " + user.getAttribute("given_name") + "!<h1>";
         return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(html);
    }
}
