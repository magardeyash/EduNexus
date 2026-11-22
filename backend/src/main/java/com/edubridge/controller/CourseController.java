package com.edubridge.controller;

import com.edubridge.model.Course;
import com.edubridge.model.User;
import com.edubridge.repository.CourseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @GetMapping("/public")
    public ResponseEntity<List<Course>> getPublicCourses() {
        return ResponseEntity.ok(courseRepository.findByStatus("published"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody Course course, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        course.setCreatedById(user.getId());
        if (course.getStatus() == null || course.getStatus().isBlank()) {
            course.setStatus("published");
        }
        Course saved = courseRepository.save(course);
        return ResponseEntity.ok(saved);
    }
}
