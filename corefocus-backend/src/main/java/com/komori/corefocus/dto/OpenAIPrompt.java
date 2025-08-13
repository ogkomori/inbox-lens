package com.komori.corefocus.dto;

import java.util.List;

public record OpenAIPrompt(String model, List<RoleAndContent> messages, double temperature) {
}
