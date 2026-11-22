package com.edubridge.repository;

import com.edubridge.model.CustomQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomQuizRepository extends JpaRepository<CustomQuiz, String> {
    List<CustomQuiz> findByIsPublicTrueOrderByCreatedAtDesc();
    List<CustomQuiz> findByCreatedByIdOrderByCreatedAtDesc(String createdById);
}
