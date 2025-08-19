package com.komori.corefocus.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GmailMessageParameters {
    private String subject;
    private String from;
    private String body;
    private String time;
}
