package tn.esprit.esponline.Services;

import java.util.List;
import tn.esprit.esponline.DAO.entities.CourseResource;

public interface ICourseResourceService {
    List<CourseResource> getAllResources();
    CourseResource addResource(CourseResource resource);
    CourseResource updateResource(CourseResource resource, int resourceId);
    void deleteResource(int resourceId);
    List<CourseResource> getResourcesByCourseId(int courseId);
}
