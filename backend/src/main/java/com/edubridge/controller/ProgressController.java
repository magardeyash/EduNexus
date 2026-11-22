package com.edubridge.controller;

import com.edubridge.model.Progress;
import com.edubridge.model.User;
import com.edubridge.repository.ProgressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressRepository progressRepository;

    public ProgressController(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @GetMapping
    public ResponseEntity<?> getProgress(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        List<Progress> progressList = progressRepository.findByUserId(user.getId());
        return ResponseEntity.ok(progressList);
    }

    @PostMapping
    public ResponseEntity<?> saveProgress(@RequestBody Map<String, Object> body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        String lessonId = (String) body.get("lessonId");
        Integer percent = body.get("percent") != null ? ((Number) body.get("percent")).intValue() : 0;
        Integer timeSpent = body.get("timeSpent") != null ? ((Number) body.get("timeSpent")).intValue() : 0;

        if (lessonId == null || lessonId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing lessonId"));
        }

        Progress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .orElseGet(() -> {
                    Progress p = new Progress();
                    p.setUserId(user.getId());
                    p.setLessonId(lessonId);
                    p.setPercent(0);
                    p.setTimeSpent(0);
                    return p;
                });

        progress.setPercent(Math.max(progress.getPercent(), percent));
        progress.setTimeSpent(progress.getTimeSpent() + timeSpent);
        if (progress.getPercent() >= 100 && progress.getCompletedAt() == null) {
            progress.setCompletedAt(LocalDateTime.now());
            progress.setPointsEarned(50);
        }

        Progress saved = progressRepository.save(progress);
        return ResponseEntity.ok(saved);
    }
}
