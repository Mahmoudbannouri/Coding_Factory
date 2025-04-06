package tn.esprit.esponline.DAO.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.esponline.DAO.entities.CategoryEnum;
import tn.esprit.esponline.DAO.entities.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    @Query("SELECT c FROM Course c WHERE " +
            "(:searchQuery IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) AND " +
            "(:category IS NULL OR c.categoryCourse = :category)")
    Page<Course> searchCourses(
            @Param("searchQuery") String searchQuery,
            @Param("category") CategoryEnum category,
            Pageable pageable
    );
    Course findById(Long courseId);
}