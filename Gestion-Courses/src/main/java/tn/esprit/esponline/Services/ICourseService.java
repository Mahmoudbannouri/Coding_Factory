package tn.esprit.esponline.Services;

import org.springframework.data.domain.Page;
import tn.esprit.esponline.DAO.entities.CategoryEnum;
import tn.esprit.esponline.DAO.entities.Course;
import java.util.List;

public interface ICourseService {
    List<Course> getAllCourses();
    Course addCourse(Course course, Integer trainerId);
    Course updateCourse(Course course, int courseId);
    void deleteCourse(int courseId);
    Course getCourseById(int courseId);
    Course enrollStudentInCourse(int courseId, Integer studentId);
    List<Course> getCoursesByTrainer(Integer trainerId);

    Page<Course> searchCoursesByTrainer(String searchQuery, CategoryEnum category, Integer trainerId, int page, int size);

    Page<Course> searchCoursesByStudent(String searchQuery, CategoryEnum category, Integer studentId, int page, int size);

    List<Course> getCoursesByStudent(Integer studentId);
    Page<Course> searchCourses(String searchQuery, CategoryEnum category, int page, int size);

    void removeStudentFromCourse(int courseId, int studentId);

    Course findById(Long courseId);
}