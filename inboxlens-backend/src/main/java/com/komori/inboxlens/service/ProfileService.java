package com.komori.inboxlens.service;

import com.komori.inboxlens.dto.Preferences;
import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository userRepository;

    public void setPreferences(String sub, Preferences preferences) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        user.setPreferredTime(preferences.getPreferredTime());
        user.setIndustries(preferences.getIndustries());
        user.setUserCategory(preferences.getUserCategory());
        user.setEmailTypes(preferences.getEmailTypes());
        userRepository.save(user);
    }

    public void setName(String sub, String name) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        user.setName(name);
        userRepository.save(user);
    }

    public void deleteAccount(String sub) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        userRepository.delete(user);
    }
}
