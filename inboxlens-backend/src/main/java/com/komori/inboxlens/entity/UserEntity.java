package com.komori.inboxlens.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
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
    private String profilePictureUrl;
    @Builder.Default
    private Boolean inboxAccessGranted = false;
    @Builder.Default
    private Set<String> userCategory = new HashSet<>();
    @Builder.Default
    private Set<String> industries = new HashSet<>();
    @Builder.Default
    private Set<String> emailTypes = new HashSet<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TrackablesEntity> trackables = new ArrayList<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ToDoListEntity> toDoList = new ArrayList<>();
    @Builder.Default
    private int digests = 0;
}
