package tn.esprit.gestion_pfe.DAO.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Entity
@Table(name = "chatbot_history")
public class ChatbotHistory {
    // Getters et Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    @Column(columnDefinition = "TEXT")
    private String conversation;

    private String predictedLevel;
    private Double popularityScore;


    private String feedback;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date(); // Valeur par défaut = maintenant



    // Constructeurs
    public ChatbotHistory() {
    }

    public ChatbotHistory(Long id  , String conversation,
                          String predictedLevel, Double popularityScore, String feedback, Date createdAt) {
        this.id = id;
        this.conversation = conversation;
        this.predictedLevel = predictedLevel;
        this.popularityScore = popularityScore;
        this.feedback = feedback;
        this.createdAt = createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }






    public void setConversation(String conversation) {
        this.conversation = conversation;
    }

    public void setPredictedLevel(String predictedLevel) {
        this.predictedLevel = predictedLevel;
    }

    public void setPopularityScore(Double popularityScore) {
        this.popularityScore = popularityScore;
    }



    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    // Méthode toString()
    @Override
    public String toString() {
        return "ChatbotHistory{" +
                "id=" + id +
                ", conversation='" + conversation + '\'' +
                ", predictedLevel='" + predictedLevel + '\'' +
                ", popularityScore=" + popularityScore +
                ", feedback='" + feedback + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
    public String getFeedback() {
        return this.feedback;
    }

    // Builder pattern (optionnel)
    public static ChatbotHistoryBuilder builder() {
        return new ChatbotHistoryBuilder();
    }

    public static class ChatbotHistoryBuilder {
        private Long id;
        private String conversation;
        private String predictedLevel;
        private Double popularityScore;
        private String feedback;
        private Date createdAt;

        public ChatbotHistoryBuilder id(Long id) {
            this.id = id;
            return this;
        }






        public ChatbotHistoryBuilder conversation(String conversation) {
            this.conversation = conversation;
            return this;
        }

        public ChatbotHistoryBuilder predictedLevel(String predictedLevel) {
            this.predictedLevel = predictedLevel;
            return this;
        }

        public ChatbotHistoryBuilder popularityScore(Double popularityScore) {
            this.popularityScore = popularityScore;
            return this;
        }

        public ChatbotHistoryBuilder feedback(String feedback) {
            this.feedback = feedback;
            return this;
        }

        public ChatbotHistoryBuilder createdAt(Date createdAt) {
            this.createdAt = createdAt;
            return this;
        }


    }
}