package com.komori.inboxlens.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "gmail.oauth2")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GmailClientProperties {
    private String client_id;
    private String client_secret;
    private String scope;
    private String redirect_uri;
    private String auth_uri;
    private String token_uri;
}
