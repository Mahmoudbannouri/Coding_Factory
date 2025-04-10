package tn.esprit.esponline.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tn.esprit.esponline.DAO.entities.CategoryEnum;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.repositories.CourseRepository;
import tn.esprit.esponline.config.JwtService;

import java.util.List;

@Service
public class CourseService implements ICourseService {

    private final CourseRepository courseRepository;
    private final JwtService jwtService;

    @Autowired
    public CourseService(CourseRepository courseRepository, JwtService jwtService) {
        this.courseRepository = courseRepository;
        this.jwtService = jwtService;
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course addCourse(Course course, Integer trainerId) {
        course.setTrainerId(trainerId);
        return courseRepository.save(course);
    }
    @Override
    public void removeStudentFromCourse(int courseId, int studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.getStudentIds() != null) {
            course.getStudentIds().remove(studentId);
            courseRepository.save(course);
        }
    }
    @Override
    public Course findById(Long courseId) {
        return courseRepository.findById(courseId);
    }
    @Override
    public List<Course> getCoursesByTrainer(Integer trainerId) {
        return courseRepository.findByTrainerId(trainerId);
    }

    @Override
    public Page<Course> searchCourses(String searchQuery, CategoryEnum category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        return courseRepository.searchCourses(searchQuery, category, pageable);
    }

    @Override
    public Page<Course> searchCoursesByTrainer(String searchQuery, CategoryEnum category, Integer trainerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        return courseRepository.findByTrainerIdAndSearch(trainerId, searchQuery, category, pageable);
    }

    @Override
    public Page<Course> searchCoursesByStudent(String searchQuery, CategoryEnum category, Integer studentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        return courseRepository.findByStudentIdAndSearch(studentId, searchQuery, category, pageable);
    }
    @Override
    public List<Course> getCoursesByStudent(Integer studentId) {
        return courseRepository.findByStudentIdsContaining(studentId);
    }

    @Override
    public Course enrollStudentInCourse(int courseId, Integer studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.getStudentIds().add(studentId);
        return courseRepository.save(course);
    }



    @Override
    public Course updateCourse(Course course, int courseId) {
        course.setId(courseId);
        return courseRepository.save(course);
    }

    @Override
    public void deleteCourse(int courseId) {
        courseRepository.deleteById(courseId);
    }

    @Override
    public Course getCourseById(int courseId) {
        return courseRepository.findById(courseId).orElse(null);
    }
}