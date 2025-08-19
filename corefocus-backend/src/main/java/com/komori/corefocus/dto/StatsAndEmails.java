package com.komori.corefocus.dto;

import java.util.List;

public record StatsAndEmails(EmailStats stats, List<GmailMessageParameters> emails) {
}
