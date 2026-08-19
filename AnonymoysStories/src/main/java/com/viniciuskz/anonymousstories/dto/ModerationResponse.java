package com.viniciuskz.anonymousstories.dto;

import java.util.List;

public record ModerationResponse (List<ModerationResult> results){
    public record ModerationResult(boolean flagged){}
}
