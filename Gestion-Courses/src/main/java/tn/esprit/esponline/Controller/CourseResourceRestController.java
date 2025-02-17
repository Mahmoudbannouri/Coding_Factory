package tn.esprit.esponline.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.esponline.DAO.entities.CourseResource;
import tn.esprit.esponline.Services.ICourseResourceService;

import java.util.List;

@Tag(name = "Course Resources", description = "This web service handles CRUD operations for course resources.")
@RestController
@AllArgsConstructor
@RequestMapping("/course-resources")
@CrossOrigin(origins = "*")
public class CourseResourceRestController {

    @Autowired
    private ICourseResourceService courseResourceService;

    @Operation(summary = "Retrieve all resources", description = "This endpoint retrieves all resources from the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all resources"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/retrieve-all-resources")
    public List<CourseResource> getAllResources() {
        return courseResourceService.getAllResources();
    }

    @Operation(summary = "Retrieve resources by course ID", description = "This endpoint retrieves resources by the specified course ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved resources"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    @GetMapping("/course/{courseId}")
    public List<CourseResource> getResourcesByCourseId(@PathVariable int courseId) {
        return courseResourceService.getResourcesByCourseId(courseId);
    }

    @Operation(summary = "Add a new resource", description = "This endpoint adds a new course resource to the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Successfully added resource"),
            @ApiResponse(responseCode = "400", description = "Invalid resource data")
    })
    @PostMapping
    public CourseResource addResource(@RequestBody CourseResource resource) {
        if (resource.getCourse() == null) {
            throw new IllegalArgumentException("Course must not be null");
        }
        return courseResourceService.addResource(resource);
    }


    @Operation(summary = "Update an existing resource", description = "This endpoint updates a course resource by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated resource"),
            @ApiResponse(responseCode = "404", description = "Resource not found")
    })
    @PutMapping("/{id}")
    public CourseResource updateResource(@RequestBody CourseResource resource, @PathVariable int id) {
        return courseResourceService.updateResource(resource, id);
    }

    @Operation(summary = "Delete a resource", description = "This endpoint deletes a course resource by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted resource"),
            @ApiResponse(responseCode = "404", description = "Resource not found")
    })
    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable int id) {
        courseResourceService.deleteResource(id);
    }
}
