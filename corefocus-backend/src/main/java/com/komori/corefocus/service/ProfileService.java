package com.komori.corefocus.service;

import com.komori.corefocus.dto.DashboardDetails;
import com.komori.corefocus.entity.UserEntity;
import com.komori.corefocus.repository.UserRepository;
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
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        return new DashboardDetails(userEntity.getName(), userEntity.getEmail());
    }

    public void setPreferredTime(String sub, String time) {
        UserEntity userEntity = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));

        userEntity.setPreferredTime(LocalTime.parse(time));
        userRepository.save(userEntity);
    }
}
