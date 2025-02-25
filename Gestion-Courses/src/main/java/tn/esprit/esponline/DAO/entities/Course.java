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

    @NotNull(message = "Description is required")
    @Size(min = 1, max = 500, message = "Description must be between 1 and 500 characters")
    private String description;

    @NotNull(message = "Rate is required")
    @Min(value = 0, message = "Rate must be at least 0")
    @Max(value = 5, message = "Rate must be at most 5")
    private int rate;

    private java.sql.Date startDate;
    private java.sql.Date endDate;

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

    public Course(String title, String description, Date startDate, Date endDate) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rate = 0; // Default value
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

    public int getRate() {
        return rate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public Date getEndDate() {
        return endDate;
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

    // Add a constructor with relevant parameters

}
