package tn.esprit.gestion_pfe.DAO.entities;



import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import tn.esprit.gestion_pfe.DAO.Enum.CategoryEnum;
import tn.esprit.gestion_pfe.DAO.Enum.PfeLevel;
import tn.esprit.gestion_pfe.DAO.Enum.PfeStatus;

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


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", timezone = "UTC")
    private Date startDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", timezone = "UTC")
    private Date endDate;


    private Long studentId;
    private Long trainerId;
    private Long entrepriseId;


    private String meetingLink;
    private String meetingNotes;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", timezone = "UTC")
    private Date meetingDate;


    @Enumerated(EnumType.STRING)
    private PfeLevel level; // Licence, Master, Ingénieur
    @Enumerated(EnumType.STRING)
    private PfeStatus status; // En cours, Validé, Refusé
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private CategoryEnum category;


    @Builder.Default
    @ElementCollection
    private List<String> documents = new ArrayList<>();

    @Builder.Default
    @ElementCollection
    @JsonFormat(pattern = "yyyy-MM-dd")
    private List<Date> meetingDates = new ArrayList<>();



    @Builder.Default
    @ElementCollection
    private List<String> juryNames = new ArrayList<>();










    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }

    public Long getEntrepriseId() {
        return entrepriseId;
    }

    public void setEntrepriseId(Long entrepriseId) {
        this.entrepriseId = entrepriseId;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getMeetingNotes() {
        return meetingNotes;
    }

    public void setMeetingNotes(String meetingNotes) {
        this.meetingNotes = meetingNotes;
    }

    public Date getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(Date meetingDate) {
        this.meetingDate = meetingDate;
    }

    public PfeLevel getLevel() {
        return level;
    }

    public void setLevel(PfeLevel level) {
        this.level = level;
    }

    public PfeStatus getStatus() {
        return status;
    }

    public void setStatus(PfeStatus status) {
        this.status = status;
    }

    public CategoryEnum getCategory() {
        return category; // Utilisation de la variable en minuscules
    }

    public void setCategory(CategoryEnum category) {
        this.category = category; // Utilisation de 'this' pour faire référence à l'attribut
    }

    public List<String> getDocuments() {
        return documents;
    }

    public void setDocuments(List<String> documents) {
        this.documents = documents;
    }

    public List<Date> getMeetingDates() {
        return meetingDates;
    }

    public void setMeetingDates(List<Date> meetingDates) {
        this.meetingDates = meetingDates;
    }

    public List<String> getJuryNames() {
        return juryNames;
    }

    public void setJuryNames(List<String> juryNames) {
        this.juryNames = juryNames;
    }



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

