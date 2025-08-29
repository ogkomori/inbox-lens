package com.komori.inboxlens.dto;

import lombok.*;

@Getter @Setter @EqualsAndHashCode
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    private String name;
    private String email;
    private String message;

    @Override
    public String toString() {
        return "Name: " + name + "\nEmail: " + email + "\nMessage: " + message;
    }
}
