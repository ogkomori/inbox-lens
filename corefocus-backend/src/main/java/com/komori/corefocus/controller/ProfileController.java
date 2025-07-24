package com.komori.corefocus.controller;

import com.komori.corefocus.dto.DashboardDetails;
import com.komori.corefocus.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<DashboardDetails> getDetails(@CurrentSecurityContext(expression = "authentication?.name") String sub) {
        DashboardDetails details = profileService.getDashboardDetails(sub);
        return ResponseEntity.ok(details);
    }

    @PostMapping("/set-preferred-time")
    public ResponseEntity<?> setPreferredTime(
            @CurrentSecurityContext(expression = "authentication?.name") String sub,
            @RequestBody Map<String, String> request) {
        String time = request.get("preferredTime");
        profileService.setPreferredTime(sub, time);
        return ResponseEntity.ok(null);
    }
}
