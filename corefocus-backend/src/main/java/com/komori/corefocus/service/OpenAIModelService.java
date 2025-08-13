package com.komori.corefocus.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.komori.corefocus.dto.OpenAIPrompt;
import com.komori.corefocus.dto.RoleAndContent;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenAIModelService {
    private static final Logger log = LoggerFactory.getLogger(OpenAIModelService.class);
    private final WebClient webClient;

    public String sendPrompt(String userPrompt) {
        OpenAIPrompt prompt = PromptBuilder.buildPrompt(userPrompt);

        String res = webClient
                    .post()
                    .bodyValue(prompt)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response ->
                            response.bodyToMono(String.class).flatMap(errorBody -> {
                                log.error("OpenAI response: {}", errorBody);
                                return Mono.error(new RuntimeException("OpenAI Error: " + errorBody));
                            })
                    )
                    .bodyToMono(String.class)
                    .block();

        if (res != null) {
            JsonObject response = JsonParser.parseString(res).getAsJsonObject();
            return response.getAsJsonArray("choices")
                    .get(0).getAsJsonObject()
                    .get("message").getAsJsonObject()
                    .get("content").getAsString();
        }

        return null;
    }


    private static class PromptBuilder {
        public static OpenAIPrompt buildPrompt(String userPrompt) {
            return new OpenAIPrompt(
                    "gpt-4o",
                    List.of(new RoleAndContent(
                            "system",
                            """
                            You are a professional email assistant.
                            You will receive an email with Subject, Body, From, and Date.
                            Your only task is to return a 1 or 2 line summary of the email.
                            """
                    ), new RoleAndContent("user", userPrompt)),
                    0.0);
        }
    }
}
