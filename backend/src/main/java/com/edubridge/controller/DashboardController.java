package com.edubridge.controller;

import com.edubridge.model.User;
import com.edubridge.repository.CourseRepository;
import com.edubridge.repository.EnrollmentRepository;
import com.edubridge.repository.ProgressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final CourseRepository courseRepository;

    public DashboardController(EnrollmentRepository enrollmentRepository, ProgressRepository progressRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        int enrolledCount = enrollmentRepository.findByUserId(user.getId()).size();
        int completedLessons = (int) progressRepository.findByUserId(user.getId()).stream()
                .filter(p -> p.getPercent() != null && p.getPercent() >= 100)
                .count();

        return ResponseEntity.ok(Map.of(
                "enrolledCourses", enrolledCount,
                "completedLessons", completedLessons,
                "totalPoints", user.getTotalPoints() != null ? user.getTotalPoints() : 0,
                "currentStreak", user.getCurrentStreak() != null ? user.getCurrentStreak() : 0
        ));
    }

    @GetMapping("/teacher-analytics")
    public ResponseEntity<?> getTeacherAnalytics(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        int totalCourses = courseRepository.findByCreatedById(user.getId()).size();

        return ResponseEntity.ok(Map.of(
                "totalCourses", totalCourses,
                "totalStudents", 0,
                "totalRevenue", 0
        ));
    }
}
