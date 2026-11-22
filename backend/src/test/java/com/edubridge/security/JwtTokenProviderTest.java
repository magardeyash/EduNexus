package com.edubridge.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secret = "edubridge_super_secret_jwt_key_2026_change_me_super_long_secret_key_12345";
    private final long expirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(secret, expirationMs);
    }

    @Test
    @DisplayName("Should generate a valid JWT token")
    void testGenerateToken() {
        String token = tokenProvider.generateToken("user-123", "student@edubridge.dev", "STUDENT");
        assertNotNull(token);
        assertFalse(token.isBlank());
        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    @DisplayName("Should extract correct user ID from valid token")
    void testGetUserIdFromToken() {
        String userId = "user-abc-456";
        String token = tokenProvider.generateToken(userId, "teacher@edubridge.dev", "TEACHER");
        String extractedId = tokenProvider.getUserIdFromToken(token);
        assertEquals(userId, extractedId);
    }

    @Test
    @DisplayName("Should return false for invalid or tampered token")
    void testValidateInvalidToken() {
        assertFalse(tokenProvider.validateToken("invalid.token.string"));
        assertFalse(tokenProvider.validateToken(""));
        assertFalse(tokenProvider.validateToken(null));
    }
}
