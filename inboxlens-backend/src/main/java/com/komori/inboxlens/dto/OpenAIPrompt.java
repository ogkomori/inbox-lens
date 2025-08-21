package com.komori.inboxlens.dto;

import java.util.List;

public record OpenAIPrompt(String model, List<RoleAndContent> messages) {
}
