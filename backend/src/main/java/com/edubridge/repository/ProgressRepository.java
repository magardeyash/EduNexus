package com.edubridge.repository;

import com.edubridge.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, String> {
    List<Progress> findByUserId(String userId);
    Optional<Progress> findByUserIdAndLessonId(String userId, String lessonId);
}
