package tn.esprit.esponline.Services;

import tn.esprit.esponline.DAO.entities.Course;

import java.util.List;

public interface ICourseService {
    List<Course> getAllCourses();
    Course addCourse(Course course);
    Course updateCourse(Course course, int courseId);
    void deleteCourse(int courseId);
    Course getCourseById(int courseId);

    Course enrollStudentInCourse(int courseId, int studentId);

    Course findById(Long courseId);
}
