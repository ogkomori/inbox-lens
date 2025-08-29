package com.komori.inboxlens.service;

import com.komori.inboxlens.dto.DashboardDetails;
import com.komori.inboxlens.dto.ToDoDTO;
import com.komori.inboxlens.entity.ToDoListEntity;
import com.komori.inboxlens.entity.TrackablesEntity;
import com.komori.inboxlens.entity.UserEntity;
import com.komori.inboxlens.exception.RepositoryException;
import com.komori.inboxlens.repository.ToDoListRepository;
import com.komori.inboxlens.repository.TrackablesRepository;
import com.komori.inboxlens.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final ToDoListRepository toDoListRepository;
    private final TrackablesRepository trackablesRepository;

    public DashboardDetails getDashboardDetails(String sub) {
        UserEntity userEntity = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        int toDos = toDoListRepository.countByUserAndStatus(userEntity, ToDoListEntity.Status.PENDING);
        int trackables = trackablesRepository.countByUser(userEntity);

        return DashboardDetails.builder()
                .email(userEntity.getEmail())
                .name(userEntity.getName())
                .digests(userEntity.getDigests())
                .toDoList(toDos)
                .trackables(trackables)
                .build();
    }

    public List<TrackablesEntity> getTrackables(String sub) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        return trackablesRepository.findAllByUser(user);
    }

    public List<ToDoListEntity> getToDoList(String sub) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        return toDoListRepository.findAllByUser(user);
    }

    public void addTask(String sub, String title) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        ToDoListEntity list = ToDoListEntity.builder()
                .title(title)
                .status(ToDoListEntity.Status.PENDING)
                .user(user)
                .build();
        try {
            toDoListRepository.save(list);
        } catch (Exception e) {
            throw new RepositoryException(e.getMessage());
        }

    }

    @Transactional
    public void deleteTask(String sub, String title) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        // the complex DELETE brings the need for the Transactional annotation
        toDoListRepository.deleteByUserAndTitle(user, title);
    }

    public void updateTask(String sub, ToDoDTO dto) {
        UserEntity user = userRepository.findBySub(sub)
                .orElseThrow(() -> new UsernameNotFoundException("Sub not found"));

        ToDoListEntity toDoListEntity = toDoListRepository.findByUserAndTitle(user, dto.getOldTitle())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        toDoListEntity.setTitle(dto.getNewTitle());
        toDoListEntity.setStatus(dto.getStatus());
        try {
            toDoListRepository.save(toDoListEntity);
        } catch (Exception e) {
            throw new RepositoryException(e.getMessage());
        }
    }
}
