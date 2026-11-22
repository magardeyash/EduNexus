package com.edubridge.controller;

import com.edubridge.dto.AuthResponse;
import com.edubridge.dto.LoginRequest;
import com.edubridge.dto.RegisterRequest;
import com.edubridge.dto.UserDto;
import com.edubridge.model.User;
import com.edubridge.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Failed to register user"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Failed to authenticate"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        UserDto userDto = authService.mapToUserDto(user);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/session")
    public ResponseEntity<?> getSession(@AuthenticationPrincipal User user) {
        if (user != null) {
            return ResponseEntity.ok(Map.of(
                    "user", authService.mapToUserDto(user),
                    "expires", LocalDateTime.now().plusDays(30).toString()
            ));
        }
        return ResponseEntity.ok(Map.of());
    }

    @GetMapping("/providers")
    public ResponseEntity<?> getProviders() {
        return ResponseEntity.ok(Map.of());
    }

    @GetMapping("/csrf")
    public ResponseEntity<?> getCsrf() {
        return ResponseEntity.ok(Map.of("csrfToken", "dummy-csrf-token"));
    }

    @PostMapping("/callback/**")
    public ResponseEntity<?> callbackFallback() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/signin/**")
    public ResponseEntity<?> signinFallback() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
