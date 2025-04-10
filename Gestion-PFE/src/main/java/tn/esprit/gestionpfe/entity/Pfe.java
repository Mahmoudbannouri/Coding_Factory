package tn.esprit.gestionpfe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import tn.esprit.gestionpfe.Enum.PfeLevel;
import tn.esprit.gestionpfe.Enum.PfeStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
@Builder
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

   private String meetingLink;
    private String meetingNotes;
    private LocalDateTime meetingDate;

    @ElementCollection
    private List<String> documents = new ArrayList<>();

    @ElementCollection
    private List<Date> meetingDates = new ArrayList<>();

    @ElementCollection
    private List<String> juryNames = new ArrayList<>();

    @OneToMany(mappedBy = "pfe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Feedback> feedbackEntities;// Liste des feedbacks sous forme d'entité


    //ou bien
    /* @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;  // Étudiant réalisant le PFE

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;  // Encadrant du PFE

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;  // Entreprise partenaire du PFE */
}