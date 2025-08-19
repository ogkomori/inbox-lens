package com.komori.corefocus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailSummary {
    private List<ActionableEmail> actionableEmailList;
    private List<ActionableEmail> lessActionableEmailList;
    private String smartInsight;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ActionableEmail {
        private String sender;
        private String subject;
        private String action;
        private String time;
        private Urgency urgency;
        private enum Urgency {HIGH, MEDIUM, LOW}
    }
}
