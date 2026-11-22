package com.edubridge.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AiTutorService {

    private final ChatModel chatModel;

    @Autowired(required = false)
    public AiTutorService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String generateTutorResponse(List<Map<String, String>> messages, String mode) {
        String systemPrompt = getSystemPrompt(mode);
        StringBuilder fullPrompt = new StringBuilder();
        fullPrompt.append("SYSTEM: ").append(systemPrompt).append("\n\n");

        if (messages != null && !messages.isEmpty()) {
            int start = Math.max(0, messages.size() - 10);
            for (int i = start; i < messages.size(); i++) {
                Map<String, String> msg = messages.get(i);
                String role = msg.getOrDefault("role", "user");
                String content = msg.getOrDefault("content", "");
                fullPrompt.append(role.toUpperCase()).append(": ").append(content).append("\n");
            }
        }

        if (chatModel != null) {
            try {
                return chatModel.call(fullPrompt.toString());
            } catch (Exception ex) {
                System.err.println("Spring AI ChatModel call failed: " + ex.getMessage());
            }
        }

        // Fallback response if LLM API is unavailable
        String lastUserMessage = "your query";
        if (messages != null && !messages.isEmpty()) {
            lastUserMessage = messages.get(messages.size() - 1).getOrDefault("content", "your question");
        }
        return "I am EduBridge AI Tutor (Spring AI engine). Regarding '" + lastUserMessage + "': "
                + "When learning tech concepts, focus on understanding the core design patterns, runtime behavior, and hands-on implementation steps!";
    }

    private String getSystemPrompt(String mode) {
        String basePrompt = "You are an expert AI tutor for EduBridge. Be encouraging, clear, and patient.";
        if (mode == null) mode = "general";

        switch (mode.toLowerCase()) {
            case "concept":
                return basePrompt + " Provide step-by-step deep dive explanations with real-world technical analogies.";
            case "practice":
                return basePrompt + " Guide the student through practice problems with hints rather than direct answers.";
            case "debate":
                return basePrompt + " Present multiple architectural viewpoints and encourage critical thinking.";
            case "general":
            default:
                return basePrompt + " Answer general learning questions with easy-to-understand technical details.";
        }
    }
}
