package com.komori.inboxlens.repository;

import com.komori.inboxlens.entity.ToDoListEntity;
import com.komori.inboxlens.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ToDoListRepository extends JpaRepository<ToDoListEntity, Long> {
    void deleteByUserAndTitle(UserEntity user, String title);

    Optional<ToDoListEntity> findByUserAndTitle(UserEntity user, String title);

    List<ToDoListEntity> findAllByUser(UserEntity user);

    int countByUserAndStatus(UserEntity user, ToDoListEntity.Status status);
}
