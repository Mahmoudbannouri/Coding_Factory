package tn.esprit.gestionpfe;

import jakarta.persistence.*;
import lombok.*;


import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Pfe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectTitle;
    private String description;
    private Date startDate;
    private Date endDate;

    @Enumerated(EnumType.STRING)
    private PfeLevel level; // Licence, Master, Ingénieur

    @Enumerated(EnumType.STRING)
    private PfeStatus status; // En cours, Validé, Refusé

    private Long studentId; // Clé étrangère vers User (étudiant)
    private Long trainerId; // Clé étrangère vers User (formateur)
    private Long entrepriseId; // Clé étrangère vers Entreprise
}