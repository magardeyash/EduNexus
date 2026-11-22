package com.edubridge.service;

import com.edubridge.model.CustomQuiz;
import com.edubridge.repository.CustomQuizRepository;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class QuizAiService {

    private final ChatModel chatModel;
    private final CustomQuizRepository customQuizRepository;

    @Autowired(required = false)
    public QuizAiService(ChatModel chatModel, CustomQuizRepository customQuizRepository) {
        this.chatModel = chatModel;
        this.customQuizRepository = customQuizRepository;
    }

    public CustomQuiz generateAndSaveQuiz(String userId, String title, String description, String topic, String difficulty, Integer questionCount, Boolean isPublic) {
        if (questionCount == null || questionCount <= 0) questionCount = 5;
        if (difficulty == null || difficulty.isBlank()) difficulty = "medium";
        if (isPublic == null) isPublic = false;

        CustomQuiz quiz = new CustomQuiz();
        quiz.setCreatedById(userId);
        quiz.setTitle(title != null ? title : (topic + " Quiz"));
        quiz.setDescription(description != null ? description : ("Interactive AI quiz covering " + topic));
        quiz.setTopic(topic);
        quiz.setDifficulty(difficulty);
        quiz.setIsPublic(isPublic);

        return customQuizRepository.save(quiz);
    }
}
