package com.edubridge.controller;

import com.edubridge.dto.UserDto;
import com.edubridge.model.Role;
import com.edubridge.model.User;
import com.edubridge.repository.UserRepository;
import com.edubridge.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        return ResponseEntity.ok(authService.mapToUserDto(user));
    }

    @PutMapping("/role")
    public ResponseEntity<?> updateRole(@RequestBody Map<String, String> body, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        String roleStr = body.get("role");
        if (roleStr == null || (!roleStr.equalsIgnoreCase("STUDENT") && !roleStr.equalsIgnoreCase("TEACHER"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
        }

        user.setRole(Role.valueOf(roleStr.toUpperCase()));
        User updated = userRepository.save(user);
        return ResponseEntity.ok(authService.mapToUserDto(updated));
    }
}
