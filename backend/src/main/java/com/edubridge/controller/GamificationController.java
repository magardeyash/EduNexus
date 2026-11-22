package com.edubridge.controller;

import com.edubridge.dto.UserDto;
import com.edubridge.model.User;
import com.edubridge.repository.UserRepository;
import com.edubridge.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public GamificationController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getGamificationStats(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(Map.of(
                "totalPoints", user.getTotalPoints() != null ? user.getTotalPoints() : 0,
                "currentStreak", user.getCurrentStreak() != null ? user.getCurrentStreak() : 0,
                "longestStreak", user.getLongestStreak() != null ? user.getLongestStreak() : 0,
                "level", user.getLevel() != null ? user.getLevel() : 1
        ));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserDto>> getLeaderboard() {
        List<User> topUsers = userRepository.findAll().stream()
                .sorted((u1, u2) -> Integer.compare(
                        u2.getTotalPoints() != null ? u2.getTotalPoints() : 0,
                        u1.getTotalPoints() != null ? u1.getTotalPoints() : 0))
                .limit(20)
                .collect(Collectors.toList());

        List<UserDto> leaderboard = topUsers.stream()
                .map(authService::mapToUserDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(leaderboard);
    }
}
