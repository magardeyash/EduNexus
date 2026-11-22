package com.edubridge.repository;

import com.edubridge.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByStatus(String status);
    List<Course> findByCreatedById(String createdById);
}
