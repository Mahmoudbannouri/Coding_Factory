package tn.esprit.esponline.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.entities.User;
import tn.esprit.esponline.Services.ICourseService;

import java.util.List;

@Tag(name = "Courses", description = "This web service handles CRUD operations for courses.")
@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseRestController {

    @Autowired
    private ICourseService courseService;

    @Operation(summary = "Retrieve all courses", description = "This endpoint retrieves all courses from the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all courses"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @Operation(summary = "Retrieve course by ID", description = "This endpoint retrieves a course by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved course"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    @GetMapping("/{courseId}/trainer-name")
    public ResponseEntity<String> getTrainerName(@PathVariable Long courseId) {
        Course course = courseService.findById(courseId);
        if (course != null && course.getTrainer() != null) {
            String trainerName = course.getTrainer().getName(); // Assuming trainer is a User object
            return ResponseEntity.ok(trainerName);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trainer not found");
        }
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable int id) {
        return courseService.getCourseById(id);
    }

    @Operation(summary = "Add a new course", description = "This endpoint adds a new course to the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Successfully added course"),
            @ApiResponse(responseCode = "400", description = "Invalid course data")
    })
    @PostMapping
    public Course addCourse(@Valid @RequestBody Course course) {
        return courseService.addCourse(course);
    }

    @Operation(summary = "Update an existing course", description = "This endpoint updates a course by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated course"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    @PutMapping("/{id}")
    public Course updateCourse(@Valid @RequestBody Course course, @PathVariable int id) {
        return courseService.updateCourse(course, id);
    }

    @Operation(summary = "Delete a course", description = "This endpoint deletes a course by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted course"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable int id) {
        courseService.deleteCourse(id);
    }

    @Operation(summary = "Enroll a student in a course", description = "This endpoint enrolls a student in a specific course.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully enrolled student in course"),
            @ApiResponse(responseCode = "404", description = "Course or student not found"),
            @ApiResponse(responseCode = "400", description = "Invalid data")
    })
    @PostMapping("/{courseId}/enroll/{studentId}")
    public Course enrollStudentInCourse(@PathVariable int courseId, @PathVariable int studentId) {
        return courseService.enrollStudentInCourse(courseId, studentId);
    }

    @Operation(summary = "Get all students", description = "This endpoint retrieves all students.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all students"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/students")
    public List<User> getAllStudents() {
        return courseService.getAllStudents();
    }
}
