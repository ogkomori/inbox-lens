package com.komori.inboxlens.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String sub;
    private String name;
    private String email;
    private String accessToken;
    private Instant accessTokenIssuedAt;
    private Instant accessTokenExpiresAt;
    private String refreshToken;
    private Instant refreshTokenIssuedAt;
    private String preferredTime;
    @Builder.Default
    private Boolean inboxAccessGranted = false;
    private Set<String> userCategory;
    private Set<String> industries;
    private Set<String> emailTypes;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TrackablesEntity> trackables = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ToDoListEntity> toDoList = new ArrayList<>();
    private int digests;
}
