package tn.esprit.esponline.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.entities.CourseResource;
import tn.esprit.esponline.DAO.repositories.CourseResourceRepository;
import java.util.List;

@Service
public class CourseResourceService implements ICourseResourceService {

    @Autowired
    private CourseResourceRepository courseResourceRepository;

    @Override
    public List<CourseResource> getAllResources() {
        return courseResourceRepository.findAll();
    }

    @Override
    public CourseResource addResource(CourseResource resource) {
        return courseResourceRepository.save(resource);
    }

    @Override
    public CourseResource updateResource(CourseResource resource, int resourceId) {
        if (courseResourceRepository.existsById(resourceId)) {
            resource.setId(resourceId);
            return courseResourceRepository.save(resource);
        } else {
            return null;
        }
    }

    @Override
    public void deleteResource(int resourceId) {
        courseResourceRepository.deleteById(resourceId);
    }

    @Override
    public List<CourseResource> getResourcesByCourseId(int courseId) {
        Course course = new Course();
        course.setId(courseId);
        return courseResourceRepository.findByCourse(course);
    }


}
