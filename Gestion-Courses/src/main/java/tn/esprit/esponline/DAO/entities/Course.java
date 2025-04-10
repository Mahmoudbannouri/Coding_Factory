package tn.esprit.esponline.DAO.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.*;

@Entity
@Data
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull @Size(min = 1, max = 100)
    private String title;

    @NotNull @Size(min = 1, max = 20)
    private String level;

    @NotNull @Size(min = 1, max = 500)
    private String description;

    private double rate;

    @NotNull
    private String image;

    @Enumerated(EnumType.STRING)
    @NotNull
    private CategoryEnum categoryCourse;

    @Column(name = "trainer_id")
    private Integer trainerId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "course_students",
            joinColumns = @JoinColumn(name = "course_id"),
            foreignKey = @ForeignKey(name = "fk_course_students_course"))
    @Column(name = "student_id")
    private Set<Integer> studentIds = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourseResource> resources;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public CategoryEnum getCategoryCourse() {
        return categoryCourse;
    }

    public void setCategoryCourse(CategoryEnum categoryCourse) {
        this.categoryCourse = categoryCourse;
    }

    public Integer getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Integer trainerId) {
        this.trainerId = trainerId;
    }

    public Set<Integer> getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(Set<Integer> studentIds) {
        this.studentIds = studentIds;
    }

    public List<CourseResource> getResources() {
        return resources;
    }

    public void setResources(List<CourseResource> resources) {
        this.resources = resources;
    }
}