package tn.esprit.esponline.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.entities.User;
import tn.esprit.esponline.DAO.repositories.CourseRepository;
import tn.esprit.esponline.DAO.repositories.UserRepository;
import tn.esprit.esponline.Services.ICourseService;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService implements ICourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public Course updateCourse(Course course, int courseId) {
        Optional<Course> existingCourse = courseRepository.findById(courseId);
        if (existingCourse.isPresent()) {
            course.setId(courseId);
            return courseRepository.save(course);
        } else {
            return null;
        }
    }

    @Override
    public void deleteCourse(int courseId) {
        courseRepository.deleteById(courseId);
    }

    @Override
    public Course getCourseById(int courseId) {
        return courseRepository.findById(courseId).orElse(null);
    }


    @Override
    public Course enrollStudentInCourse(int courseId, int studentId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        Optional<User> studentOpt = userRepository.findById(studentId);

        if (courseOpt.isPresent() && studentOpt.isPresent()) {
            Course course = courseOpt.get();
            User student = studentOpt.get();

            course.getStudents().add(student);
            courseRepository.save(course);

            return course;
        }
        return null;
    }

    @Override
    public Course findById(Long courseId) {
        return courseRepository.findById(courseId);
    }
}
