package com.komori.inboxlens.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailStats {
    private Integer total;
    private Integer promotions;
    private Integer updates;
    private Integer social;
    private Integer forums;
    private Integer personal;
}
