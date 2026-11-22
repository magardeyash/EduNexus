package com.edubridge.dto;

import com.edubridge.model.Role;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private Role role;
    private Integer totalPoints;
    private Integer currentStreak;
    private Integer level;
    private String image;

    public UserDto() {}

    public UserDto(String id, String name, String email, Role role, Integer totalPoints, Integer currentStreak, Integer level, String image) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.totalPoints = totalPoints;
        this.currentStreak = currentStreak;
        this.level = level;
        this.image = image;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String name;
        private String email;
        private Role role;
        private Integer totalPoints;
        private Integer currentStreak;
        private Integer level;
        private String image;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder totalPoints(Integer totalPoints) { this.totalPoints = totalPoints; return this; }
        public Builder currentStreak(Integer currentStreak) { this.currentStreak = currentStreak; return this; }
        public Builder level(Integer level) { this.level = level; return this; }
        public Builder image(String image) { this.image = image; return this; }

        public UserDto build() {
            return new UserDto(id, name, email, role, totalPoints, currentStreak, level, image);
        }
    }
}
