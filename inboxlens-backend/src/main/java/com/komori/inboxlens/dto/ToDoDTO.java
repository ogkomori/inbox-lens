package com.komori.inboxlens.dto;

import com.komori.inboxlens.entity.ToDoListEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ToDoDTO {
    private String oldTitle;
    private String newTitle;
    private ToDoListEntity.Status status;
}
