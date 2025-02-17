package tn.esprit.esponline.DAO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.entities.CourseResource;

import java.util.List;

public interface CourseResourceRepository extends JpaRepository<CourseResource, Integer> {
    List<CourseResource> findByCourse(Course course);
}