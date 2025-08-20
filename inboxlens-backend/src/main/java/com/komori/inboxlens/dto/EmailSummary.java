package com.komori.inboxlens.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailSummary {
    private List<ActionableEmail> actionableEmailList;
    private List<ImportantInformationEmail> importantInformationList;
    private String smartInsight;
    private String shortSummary;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ActionableEmail {
        private String sender;
        private String subject;
        private String action;
        private String time;
        private Urgency urgency;
        private enum Urgency {HIGH, LOW}
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImportantInformationEmail {
        private String sender;
        private String subject;
        private String time;
        private String info;
    }
}
