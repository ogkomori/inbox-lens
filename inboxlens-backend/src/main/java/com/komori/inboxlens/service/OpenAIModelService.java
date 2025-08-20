package com.komori.inboxlens.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.komori.inboxlens.dto.*;
import com.komori.inboxlens.exception.OpenAIException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAIModelService {
    private final String summaryPrompt;
    private final WebClient webClient;

    public EmailSummary sendEmailSummaryPrompt(List<GmailMessageParameters> parametersList) {
        OpenAIPrompt prompt = new OpenAIPrompt(
                "gpt-5-nano",
                List.of(new RoleAndContent(
                        "system",
                        summaryPrompt
                ), new RoleAndContent("user", parametersList)),
                1);
        String modelResponse = sendPrompt(prompt);

        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(modelResponse, EmailSummary.class);
        } catch (JsonProcessingException e) {
            throw new OpenAIException("Error converting JSON with ObjectMapper");
        }
    }

    private String sendPrompt(OpenAIPrompt prompt) {
        String res = webClient
                    .post()
                    .bodyValue(prompt)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response ->
                            response.bodyToMono(String.class).flatMap(errorBody -> {
                                log.error("OpenAI response: {}", errorBody);
                                return Mono.error(new OpenAIException("OpenAI Error: " + errorBody));
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
        else {
            throw new OpenAIException("Model response is null");
        }
    }
}
