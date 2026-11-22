package com.edubridge.service;

import com.edubridge.dto.AuthResponse;
import com.edubridge.dto.LoginRequest;
import com.edubridge.dto.RegisterRequest;
import com.edubridge.model.Role;
import com.edubridge.model.User;
import com.edubridge.repository.UserRepository;
import com.edubridge.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, tokenProvider);
    }

    @Test
    @DisplayName("Should register new user successfully")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");
        request.setRole("STUDENT");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        User savedUser = User.builder()
                .id("user-1")
                .name("John Doe")
                .email("john@example.com")
                .passwordHash("encodedPassword")
                .role(Role.STUDENT)
                .totalPoints(0)
                .currentStreak(0)
                .level(1)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateToken("user-1", "john@example.com", "STUDENT")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("john@example.com", response.getUser().getEmail());
        assertEquals(Role.STUDENT, response.getUser().getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when registering with already existing email")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Jane Doe");
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        User existingUser = User.builder().email("existing@example.com").build();
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(existingUser));

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("correctPassword");

        User user = User.builder()
                .id("user-99")
                .email("user@example.com")
                .passwordHash("hashedPass")
                .role(Role.TEACHER)
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correctPassword", "hashedPass")).thenReturn(true);
        when(tokenProvider.generateToken("user-99", "user@example.com", "TEACHER")).thenReturn("valid-jwt");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("valid-jwt", response.getToken());
        assertEquals("user@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should throw exception when logging in with invalid password")
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrongPassword");

        User user = User.builder()
                .id("user-99")
                .email("user@example.com")
                .passwordHash("hashedPass")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "hashedPass")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }
}
