package com.komori.inboxlens.service;

import com.komori.inboxlens.dto.DashboardDetails;
import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository userRepository;

    public DashboardDetails getDashboardDetails(String sub) {
        UserEntity userEntity = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        return new DashboardDetails(userEntity.getName(), userEntity.getEmail());
    }

    public void setPreferredTime(String sub, String time) {
        UserEntity userEntity = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        userEntity.setPreferredTime(LocalTime.parse(time));
        userRepository.save(userEntity);
    }
}
