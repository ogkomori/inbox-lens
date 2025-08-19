package com.komori.corefocus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class OpenAIConfig {
    @Value("${open.api.key}")
    private String OPEN_API_KEY;

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("Authorization", "Bearer " + OPEN_API_KEY)
                .build();
    }

    @Bean
    public String summaryPrompt() {
        try(InputStream inputStream = OpenAIConfig.class
                .getClassLoader()
                .getResourceAsStream("prompts/summary_prompt.txt")) {
            if (inputStream == null) {
                throw new FileNotFoundException("SummaryPrompt file not found");
            }
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
