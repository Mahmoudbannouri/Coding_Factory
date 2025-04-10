package tn.esprit.esponline.DAO.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;


import java.sql.Date;
import java.util.List;
import java.util.Set;

@Entity

@Data

@ToString
@Getter
@Setter
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull(message = "Title is required")
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    private String title;

    @Size(min = 1, max = 20, message = "level must be between 1 and 100 characters")
    @NotNull(message = "Level is required")
    private String level;

    @NotNull(message = "Description is required")
    @Size(min = 1, max = 500, message = "Description must be between 1 and 500 characters")
    private String description;

    private double rate; // Average rating of the course


    @NotNull(message = "image is required")
    private String image;  // Assuming it's a URL to the image or path.

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Category is required")
    private CategoryEnum categoryCourse;


    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;


    @JsonIgnore
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourseResource> resources;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "students_courses",
            joinColumns = @JoinColumn(name = "id_course"),
            inverseJoinColumns = @JoinColumn(name = "id_student")
    )
    private Set<User> students;

    public Course(String title, String description,String level) {
        this.title = title;
        this.description = description;
        this.level=level;
        this.image = ""; // Default value
    }

    public Course() {

    }


    // Optionally: you can also add a setter if needed
    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }




    public CategoryEnum getCategoryCourse() {
        return categoryCourse;
    }

    public User getTrainer() {
        return trainer;
    }

    public List<CourseResource> getResources() {
        return resources;
    }

    public Set<User> getStudents() {
        return students;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    // Add a constructor with relevant parameters

}
