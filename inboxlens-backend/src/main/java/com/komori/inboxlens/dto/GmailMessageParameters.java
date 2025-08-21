package com.komori.inboxlens.dto;

import lombok.*;

@Getter @Setter @EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GmailMessageParameters {
    private String subject;
    private String from;
    private String body;
    private String time;

    @Override
    public String toString() {
        return "From: " + from + "\nSubject: " + subject + "\nTime: " + time + "\nBody: " + body + "\n";
    }
}
