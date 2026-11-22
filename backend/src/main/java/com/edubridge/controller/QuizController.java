package com.edubridge.controller;

import com.edubridge.model.CustomQuiz;
import com.edubridge.model.User;
import com.edubridge.repository.CustomQuizRepository;
import com.edubridge.service.QuizAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final CustomQuizRepository quizRepository;
    private final QuizAiService quizAiService;

    public QuizController(CustomQuizRepository quizRepository, QuizAiService quizAiService) {
        this.quizRepository = quizRepository;
        this.quizAiService = quizAiService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<CustomQuiz>> getPublicQuizzes() {
        return ResponseEntity.ok(quizRepository.findByIsPublicTrueOrderByCreatedAtDesc());
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyQuizzes(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(quizRepository.findByCreatedByIdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable String id) {
        return quizRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(@RequestBody Map<String, Object> body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        String topic = (String) body.get("topic");
        String difficulty = (String) body.getOrDefault("difficulty", "medium");
        Integer questionCount = body.get("questionCount") instanceof Number ? ((Number) body.get("questionCount")).intValue() : 5;
        Boolean isPublic = body.get("isPublic") instanceof Boolean ? (Boolean) body.get("isPublic") : false;

        CustomQuiz quiz = quizAiService.generateAndSaveQuiz(user.getId(), title, description, topic, difficulty, questionCount, isPublic);
        return ResponseEntity.ok(Map.of("success", true, "quizId", quiz.getId(), "quiz", quiz));
    }

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody CustomQuiz quiz, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        quiz.setCreatedById(user.getId());
        CustomQuiz saved = quizRepository.save(quiz);
        return ResponseEntity.ok(saved);
    }
}

