package com.edubridge.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "\"User\"")
public class User {

    @Id
    @Column(name = "\"id\"", nullable = false)
    private String id;

    @Column(name = "\"name\"")
    private String name;

    @Column(name = "\"email\"", unique = true)
    private String email;

    @Column(name = "\"emailVerified\"")
    private LocalDateTime emailVerified;

    @Column(name = "\"image\"")
    private String image;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"role\"")
    private Role role;

    @Column(name = "\"passwordHash\"")
    private String passwordHash;

    @Column(name = "\"totalPoints\"", nullable = false)
    private Integer totalPoints = 0;

    @Column(name = "\"currentStreak\"", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "\"longestStreak\"", nullable = false)
    private Integer longestStreak = 0;

    @Column(name = "\"lastActivityDate\"")
    private LocalDateTime lastActivityDate;

    @Column(name = "\"level\"", nullable = false)
    private Integer level = 1;

    @CreationTimestamp
    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "\"updatedAt\"", nullable = false)
    private LocalDateTime updatedAt;

    public User() {}

    public User(String id, String name, String email, LocalDateTime emailVerified, String image, Role role, String passwordHash, Integer totalPoints, Integer currentStreak, Integer longestStreak, LocalDateTime lastActivityDate, Integer level, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.emailVerified = emailVerified;
        this.image = image;
        this.role = role;
        this.passwordHash = passwordHash;
        this.totalPoints = totalPoints != null ? totalPoints : 0;
        this.currentStreak = currentStreak != null ? currentStreak : 0;
        this.longestStreak = longestStreak != null ? longestStreak : 0;
        this.lastActivityDate = lastActivityDate;
        this.level = level != null ? level : 1;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.isBlank()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getEmailVerified() { return emailVerified; }
    public void setEmailVerified(LocalDateTime emailVerified) { this.emailVerified = emailVerified; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }

    public LocalDateTime getLastActivityDate() { return lastActivityDate; }
    public void setLastActivityDate(LocalDateTime lastActivityDate) { this.lastActivityDate = lastActivityDate; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String name;
        private String email;
        private LocalDateTime emailVerified;
        private String image;
        private Role role;
        private String passwordHash;
        private Integer totalPoints = 0;
        private Integer currentStreak = 0;
        private Integer longestStreak = 0;
        private LocalDateTime lastActivityDate;
        private Integer level = 1;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder emailVerified(LocalDateTime emailVerified) { this.emailVerified = emailVerified; return this; }
        public Builder image(String image) { this.image = image; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public Builder totalPoints(Integer totalPoints) { this.totalPoints = totalPoints; return this; }
        public Builder currentStreak(Integer currentStreak) { this.currentStreak = currentStreak; return this; }
        public Builder longestStreak(Integer longestStreak) { this.longestStreak = longestStreak; return this; }
        public Builder lastActivityDate(LocalDateTime lastActivityDate) { this.lastActivityDate = lastActivityDate; return this; }
        public Builder level(Integer level) { this.level = level; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, name, email, emailVerified, image, role, passwordHash, totalPoints, currentStreak, longestStreak, lastActivityDate, level, createdAt, updatedAt);
        }
    }
}
