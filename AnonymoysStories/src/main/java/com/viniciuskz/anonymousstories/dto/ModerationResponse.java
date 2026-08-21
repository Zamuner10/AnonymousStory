package com.viniciuskz.anonymousstories.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record ModerationResponse(
        List<Result> results
) {
    // Declarados DENTRO do record principal, eles podem ser public!
    public record Result(
            boolean flagged,
            Categories categories,
            @JsonProperty("category_scores") Map<String, Double> categoryScores
    ) {}

    public record Categories(
            boolean hate,
            @JsonProperty("hate/threatening") boolean hateThreatening,
            boolean harassment,
            @JsonProperty("harassment/threatening") boolean harassmentThreatening,
            boolean sexual,
            @JsonProperty("sexual/minors") boolean sexualMinors,
            boolean selfHarm,
            @JsonProperty("self-harm") boolean selfHarmDetail,
            boolean violence,
            @JsonProperty("violence/graphic") boolean violenceGraphic
    ) {}
}