package tn.esprit.esponline.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.esponline.DAO.entities.CategoryEnum;
import tn.esprit.esponline.DAO.entities.Course;
import tn.esprit.esponline.DAO.entities.User;
import tn.esprit.esponline.Services.ICourseService;
import tn.esprit.esponline.Services.IFileStorageService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Tag(name = "Courses", description = "This web service handles CRUD operations for courses.")
@RestController
@RequestMapping("/courses")
public class CourseRestController {

    @Autowired
    private ICourseService courseService;

    @Autowired
    private IFileStorageService fileStorageService;

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
    public ResponseEntity<Course> updateCourse(
            @PathVariable int id,
            @Valid @RequestBody Course course) {

        Course updatedCourse = courseService.updateCourse(course, id);
        if (updatedCourse != null) {
            return ResponseEntity.ok(updatedCourse);
        } else {
            return ResponseEntity.notFound().build();
        }
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

    @Operation(summary = "Get enrolled students for a course", description = "This endpoint retrieves the list of students enrolled in a specific course.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved enrolled students"),
            @ApiResponse(responseCode = "404", description = "Course not found")
    })
    @GetMapping("/{courseId}/students")
    public List<User> getEnrolledStudents(@PathVariable int courseId) {
        return courseService.getEnrolledStudents(courseId);
    }
    @GetMapping("/search")
    public ResponseEntity<Page<Course>> searchCourses(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) CategoryEnum category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Page<Course> courses = courseService.searchCourses(searchQuery, category, page, size);
        return ResponseEntity.ok(courses);
    }

    ///hedhi mta3 node js

    @PutMapping("/{id}/update-rate")
    public ResponseEntity<Void> updateCourseRate(
            @PathVariable int id,
            @RequestBody Map<String, Double> request) {

        try {
            if (request == null || !request.containsKey("rate")) {
                return ResponseEntity.badRequest().build();
            }

            Double rate = request.get("rate");
            Course course = courseService.getCourseById(id);

            if (course == null) {
                return ResponseEntity.notFound().build();
            }

            course.setRate(rate);
            courseService.updateCourse(course, id);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    ///hedhi mta3 springboot
    /*
    @PutMapping("/{id}/update-rate")
    public ResponseEntity<Void> updateCourseRate(@PathVariable int id, @RequestBody double rate) {
        Course course = courseService.getCourseById(id);
        if (course != null) {
            course.setRate(rate);
            courseService.updateCourse(course, id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

*/
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.uploadFile(file);
            return ResponseEntity.ok(fileUrl); // Just return the plain string URL
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }
    @DeleteMapping("/delete-file")
    public ResponseEntity<String> deleteFile(@RequestParam String fileUrl) {
        try {
            fileStorageService.deleteFile(fileUrl);
            return ResponseEntity.ok("File deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete file: " + e.getMessage());
        }
    }
}
