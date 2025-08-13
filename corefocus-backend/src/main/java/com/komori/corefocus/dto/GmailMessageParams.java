package com.komori.corefocus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GmailMessageParams {
    private String subject;
    private String from;
    private String body;
    private LocalDate date;
}
