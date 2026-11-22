package com.edubridge.controller;

import com.edubridge.service.AiTutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-tutor")
public class AiTutorController {

    private final AiTutorService aiTutorService;

    public AiTutorController(AiTutorService aiTutorService) {
        this.aiTutorService = aiTutorService;
    }

    @PostMapping
    public ResponseEntity<?> tutorChat(@RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, String>> messages = (List<Map<String, String>>) body.get("messages");
            String mode = (String) body.getOrDefault("mode", "general");

            String response = aiTutorService.generateTutorResponse(messages, mode);
            return ResponseEntity.ok(Map.of("message", response, "response", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to process AI tutor request: " + e.getMessage()));
        }
    }
}
