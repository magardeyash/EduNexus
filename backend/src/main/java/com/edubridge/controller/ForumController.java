package com.edubridge.controller;

import com.edubridge.model.Reply;
import com.edubridge.model.Thread;
import com.edubridge.model.User;
import com.edubridge.repository.ReplyRepository;
import com.edubridge.repository.ThreadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ThreadRepository threadRepository;
    private final ReplyRepository replyRepository;

    public ForumController(ThreadRepository threadRepository, ReplyRepository replyRepository) {
        this.threadRepository = threadRepository;
        this.replyRepository = replyRepository;
    }

    @GetMapping("/threads")
    public ResponseEntity<List<Thread>> getAllThreads(@RequestParam(required = false) String courseId) {
        if (courseId != null && !courseId.isBlank()) {
            return ResponseEntity.ok(threadRepository.findByCourseIdOrderByCreatedAtDesc(courseId));
        }
        return ResponseEntity.ok(threadRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/threads/{id}")
    public ResponseEntity<?> getThreadById(@PathVariable String id) {
        return threadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/threads")
    public ResponseEntity<?> createThread(@RequestBody Thread thread, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        thread.setAuthorId(user.getId());
        Thread saved = threadRepository.save(thread);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/threads/{id}/replies")
    public ResponseEntity<List<Reply>> getReplies(@PathVariable String id) {
        return ResponseEntity.ok(replyRepository.findByThreadIdOrderByCreatedAtAsc(id));
    }

    @PostMapping("/threads/{id}/replies")
    public ResponseEntity<?> createReply(@PathVariable String id, @RequestBody Map<String, String> body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        String bodyText = body.get("body");
        if (bodyText == null || bodyText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Reply body cannot be empty"));
        }

        Reply reply = new Reply();
        reply.setThreadId(id);
        reply.setAuthorId(user.getId());
        reply.setBody(bodyText);

        Reply saved = replyRepository.save(reply);
        return ResponseEntity.ok(saved);
    }
}
