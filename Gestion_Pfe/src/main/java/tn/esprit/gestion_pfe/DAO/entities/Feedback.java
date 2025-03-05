package tn.esprit.gestion_pfe.DAO.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author; // Nom de l'évaluateur (encadrant, jury, etc.)
    private String comment; // Le feedback donné
    private LocalDateTime date; // Date du feedback


    @ManyToOne
    @JoinColumn(name = "pfe_id")
    @JsonIgnore
    @JsonBackReference
    private Pfe pfe; // Évite la boucle infinie

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Pfe getPfe() {
        return pfe;
    }

    public void setPfe(Pfe pfe) {
        this.pfe = pfe;
    }
}
