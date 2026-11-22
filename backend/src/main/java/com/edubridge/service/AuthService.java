package com.edubridge.service;

import com.edubridge.dto.AuthResponse;
import com.edubridge.dto.LoginRequest;
import com.edubridge.dto.RegisterRequest;
import com.edubridge.dto.UserDto;
import com.edubridge.model.Role;
import com.edubridge.model.User;
import com.edubridge.repository.UserRepository;
import com.edubridge.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        Role role = Role.STUDENT;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("TEACHER")) {
            role = Role.TEACHER;
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .totalPoints(0)
                .currentStreak(0)
                .longestStreak(0)
                .level(1)
                .build();

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(savedUser))
                .message("User registered successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String roleStr = user.getRole() != null ? user.getRole().name() : "STUDENT";
        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), roleStr);

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(user))
                .message("Logged in successfully")
                .build();
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .totalPoints(user.getTotalPoints())
                .currentStreak(user.getCurrentStreak())
                .level(user.getLevel())
                .image(user.getImage())
                .build();
    }
}
