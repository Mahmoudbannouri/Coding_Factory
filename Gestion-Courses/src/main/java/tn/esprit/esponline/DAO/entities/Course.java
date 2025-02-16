package tn.esprit.esponline.DAO.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.sql.Date;
import java.util.List;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    private String description;
    private int rate;
    private java.sql.Date startDate;
    private java.sql.Date endDate;
    private String image;  // Assuming it's a URL to the image or path.

    @Enumerated(EnumType.STRING)
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
}
