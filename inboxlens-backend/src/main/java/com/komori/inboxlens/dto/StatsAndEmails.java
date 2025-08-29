package com.komori.inboxlens.dto;

import java.util.List;

public record StatsAndEmails(EmailStats stats, List<String> emails) {
}
