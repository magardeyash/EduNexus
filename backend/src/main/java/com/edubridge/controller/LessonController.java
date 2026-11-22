package com.edubridge.controller;

import com.edubridge.model.Lesson;
import com.edubridge.repository.LessonRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonRepository lessonRepository;

    public LessonController(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @GetMapping
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@RequestParam String courseId) {
        return ResponseEntity.ok(lessonRepository.findByCourseIdOrderByOrderAsc(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLessonById(@PathVariable String id) {
        return lessonRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        Lesson saved = lessonRepository.save(lesson);
        return ResponseEntity.ok(saved);
    }
}
