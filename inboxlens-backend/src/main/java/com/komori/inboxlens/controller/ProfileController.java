package com.komori.inboxlens.controller;

import com.komori.inboxlens.dto.Preferences;
import com.komori.inboxlens.exception.UnauthorizedException;
import com.komori.inboxlens.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/set-preferences")
    public ResponseEntity<String> setPreferences(@CurrentSecurityContext(expression = "authentication?.name") String sub,
                                            @RequestBody Preferences preferences) {
        if (sub == null || sub.equals("anonymousUser")) {
            throw new UnauthorizedException("User is not logged in");
        }

        profileService.setPreferences(sub, preferences);
        return ResponseEntity.ok("Preferences saved successfully");
    }

    @PatchMapping("/set-name")
    public ResponseEntity<String> setName(@CurrentSecurityContext(expression = "authentication?.name") String sub,
                                          @RequestBody String name) {
        if (sub == null || sub.equals("anonymousUser")) {
            throw new UnauthorizedException("User is not logged in");
        }

        profileService.setName(sub, name);
        return ResponseEntity.ok("Name changed successfully");
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(@CurrentSecurityContext(expression = "authentication?.name") String sub) {
        if (sub == null || sub.equals("anonymousUser")) {
            throw new UnauthorizedException("User is not logged in");
        }

        profileService.deleteAccount(sub);
        return ResponseEntity.ok("Account deleted successfully");
    }
}
