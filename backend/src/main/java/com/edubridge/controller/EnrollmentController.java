package com.edubridge.controller;

import com.edubridge.model.Enrollment;
import com.edubridge.model.User;
import com.edubridge.repository.EnrollmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentController(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping
    public ResponseEntity<?> getUserEnrollments(@AuthenticationPrincipal User user, @RequestParam(required = false) String courseId) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        if (courseId != null && !courseId.isBlank()) {
            return ResponseEntity.ok(enrollmentRepository.findByUserIdAndCourseId(user.getId(), courseId)
                    .map(List::of)
                    .orElse(List.of()));
        }
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
        return ResponseEntity.ok(enrollments);
    }

    @PostMapping
    public ResponseEntity<?> enrollInCourse(@RequestBody Map<String, String> body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        String courseId = body.get("courseId");
        if (courseId == null || courseId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing courseId"));
        }

        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already enrolled in this course"));
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(user.getId());
        enrollment.setCourseId(courseId);
        enrollment.setStatus("active");

        Enrollment saved = enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(saved);
    }
}
