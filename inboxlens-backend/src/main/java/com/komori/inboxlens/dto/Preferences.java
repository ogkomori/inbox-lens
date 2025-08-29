package com.komori.inboxlens.dto;

import lombok.*;

import java.util.Set;

@Getter @Setter @EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Preferences {
    private String preferredTime;
    private Set<String> userCategory;
    private Set<String> industries;
    private Set<String> emailTypes;

    @Override
    public String toString() {
        return "UserCategories: " + (userCategory != null && !userCategory.isEmpty()
                ? String.join(", ", userCategory)
                : "None") + "\n" +
                "Industries: " + (industries != null && !industries.isEmpty()
                ? String.join(", ", industries)
                : "None") + "\n" +
                "EmailTypes: " + (emailTypes != null && !emailTypes.isEmpty()
                ? String.join(", ", emailTypes)
                : "None") + "\n";
    }
}
