package com.edubridge.repository;

import com.edubridge.model.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, String> {
    List<LearningSession> findByUserIdOrderByCreatedAtDesc(String userId);
}
