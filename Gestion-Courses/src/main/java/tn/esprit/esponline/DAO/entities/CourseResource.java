package tn.esprit.esponline.DAO.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "courses_resource")
@Getter
@Setter
public class CourseResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;  // Title of the resource (e.g., "Chapter 1")
    private String resourceType;
    private String link_video;
    private String link_doccument;
    private String description;
    private java.sql.Date uploadDate;

    @ManyToOne
    @JoinColumn(name = "courses_id")
    private Course course;

    public Course getCourse() {
        return course;
    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    public void setCourse(Course course) {
        this.course = course;
    }

    public String getResourceType() {
        return resourceType;
    }



    public String getDescription() {
        return description;
    }

    public Date getUploadDate() {
        return uploadDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLink_video() {
        return link_video;
    }

    public void setLink_video(String link_video) {
        this.link_video = link_video;
    }

    public String getLink_doccument() {
        return link_doccument;
    }

    public void setLink_doccument(String link_doccument) {
        this.link_doccument = link_doccument;
    }
}
