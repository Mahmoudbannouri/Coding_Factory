package tn.esprit.esponline.DAO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.esponline.DAO.entities.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    Course findById(Long courseId);
}