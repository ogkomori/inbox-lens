package com.komori.inboxlens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDetails {
    private String name;
    private String email;
    private String picture;
    private int trackables;
    private int toDoList;
    private int digests;
}
