package tn.esprit.esponline.Services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.esponline.DAO.entities.CategoryEnum;
import tn.esprit.esponline.DAO.entities.Course;

import java.util.List;
import java.util.Map;

public interface ICourseService {
    List<Course> getAllCourses();
    Course addCourse(Course course, Integer trainerId);
    List<Course> searchAllCourses(String searchQuery, CategoryEnum category);
    List<Course> searchAllCoursesByTrainer(String searchQuery, CategoryEnum category, Integer trainerId);
    List<Course> searchAllCoursesByStudent(String searchQuery, CategoryEnum category, Integer studentId);


    Course updateCourse(Course course, int courseId);
    void deleteCourse(int courseId);
    Course getCourseById(int courseId);



    Course findById(Long courseId);




    Course enrollStudentInCourse(int courseId, int studentId);

    void removeStudentFromCourse(int courseId, int studentId);


    List<Course> getCoursesByStudent(int studentId);

    List<Map<String, Object>> getEnrolledStudentsWithDetails(int courseId);

    List<Course> getCoursesByTrainer(Integer userId);





}