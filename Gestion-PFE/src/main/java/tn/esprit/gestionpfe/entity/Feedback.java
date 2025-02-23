package tn.esprit.gestionpfe.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
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

}
