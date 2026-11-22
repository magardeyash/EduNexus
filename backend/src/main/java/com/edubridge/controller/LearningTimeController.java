package com.edubridge.controller;

import com.edubridge.model.LearningSession;
import com.edubridge.model.User;
import com.edubridge.repository.LearningSessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning-time")
public class LearningTimeController {

    private final LearningSessionRepository learningSessionRepository;

    public LearningTimeController(LearningSessionRepository learningSessionRepository) {
        this.learningSessionRepository = learningSessionRepository;
    }

    @GetMapping
    public ResponseEntity<?> getLearningSessions(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        List<LearningSession> sessions = learningSessionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(sessions);
    }

    @PostMapping
    public ResponseEntity<?> recordLearningSession(@RequestBody Map<String, Object> body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String lessonId = (String) body.get("lessonId");
        String courseId = (String) body.get("courseId");
        Integer duration = body.get("duration") != null ? ((Number) body.get("duration")).intValue() : 0;

        if (lessonId == null || courseId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing lessonId or courseId"));
        }

        LearningSession session = new LearningSession();
        session.setUserId(user.getId());
        session.setLessonId(lessonId);
        session.setCourseId(courseId);
        session.setDuration(duration);
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(LocalDateTime.now());
        session.setDate(LocalDateTime.now());

        LearningSession saved = learningSessionRepository.save(session);
        return ResponseEntity.ok(saved);
    }
}
