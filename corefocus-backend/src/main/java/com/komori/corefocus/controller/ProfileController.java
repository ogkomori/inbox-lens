package com.komori.corefocus.controller;

import com.komori.corefocus.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/api/set-preferred-time")
    public ResponseEntity<Void> setPreferredTime(
            @CurrentSecurityContext(expression = "authentication?.name") String sub,
            @RequestBody Map<String, String> request) {
        String time = request.get("preferredTime");
        profileService.setPreferredTime(sub, time);
        return ResponseEntity.ok().build();
    }
}
