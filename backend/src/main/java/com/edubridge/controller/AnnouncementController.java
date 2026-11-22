package com.edubridge.controller;

import com.edubridge.model.Announcement;
import com.edubridge.model.User;
import com.edubridge.repository.AnnouncementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAnnouncements(@RequestParam(required = false) String courseId) {
        if (courseId != null && !courseId.isBlank()) {
            return ResponseEntity.ok(announcementRepository.findByCourseIdOrderByCreatedAtDesc(courseId));
        }
        return ResponseEntity.ok(announcementRepository.findByIsPublicTrueOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        announcement.setAuthorId(user.getId());
        Announcement saved = announcementRepository.save(announcement);
        return ResponseEntity.ok(saved);
    }
}
