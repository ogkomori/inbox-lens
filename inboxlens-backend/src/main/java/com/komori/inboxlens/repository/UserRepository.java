package com.komori.inboxlens.repository;

import com.komori.inboxlens.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findBySub(String sub);
    Boolean existsBySub(String sub);
}
