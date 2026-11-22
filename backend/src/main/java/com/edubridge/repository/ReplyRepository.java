package com.edubridge.repository;

import com.edubridge.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, String> {
    List<Reply> findByThreadIdOrderByCreatedAtAsc(String threadId);
}
