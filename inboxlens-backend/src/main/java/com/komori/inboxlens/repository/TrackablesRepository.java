package com.komori.inboxlens.repository;

import com.komori.inboxlens.entity.TrackablesEntity;
import com.komori.inboxlens.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackablesRepository extends JpaRepository<TrackablesEntity, Long> {
    int countByUser(UserEntity user);

    List<TrackablesEntity> findAllByUser(UserEntity user);
}
