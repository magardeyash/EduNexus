package com.edubridge.repository;

import com.edubridge.model.Thread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, String> {
    List<Thread> findByCourseIdOrderByCreatedAtDesc(String courseId);
    List<Thread> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    List<Thread> findAllByOrderByCreatedAtDesc();
}
