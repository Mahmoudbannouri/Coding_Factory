package tn.esprit.esponline.DAO.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.esponline.DAO.entities.CategoryEnum;
import tn.esprit.esponline.DAO.entities.Course;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    @Query("SELECT c FROM Course c WHERE " +
            "(:searchQuery IS NULL OR :searchQuery = '' OR " +
            "LOWER(c.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) AND " +
            "(:category IS NULL OR c.categoryCourse = :category)")
    Page<Course> searchCourses(
            @Param("searchQuery") String searchQuery,
            @Param("category") CategoryEnum category,
            Pageable pageable);

    @Query("SELECT c FROM Course c WHERE " +
            "c.trainerId = :trainerId AND " +
            "(:searchQuery IS NULL OR :searchQuery = '' OR " +
            "LOWER(c.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) AND " +
            "(:category IS NULL OR c.categoryCourse = :category)")
    Page<Course> findByTrainerIdAndSearch(
            @Param("trainerId") Integer trainerId,
            @Param("searchQuery") String searchQuery,
            @Param("category") CategoryEnum category,
            Pageable pageable);

    @Query("SELECT c FROM Course c WHERE " +
            ":studentId MEMBER OF c.studentIds AND " +
            "(:searchQuery IS NULL OR :searchQuery = '' OR " +
            "LOWER(c.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) AND " +
            "(:category IS NULL OR c.categoryCourse = :category)")
    Page<Course> findByStudentIdAndSearch(
            @Param("studentId") Integer studentId,
            @Param("searchQuery") String searchQuery,
            @Param("category") CategoryEnum category,
            Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.trainerId = :trainerId")
    List<Course> findByTrainerId(@Param("trainerId") Integer trainerId);

    List<Course> findByStudentIdsContaining(Integer studentId);
    Optional<Course> findById(Long id);
}