package tn.esprit.esponline.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
import tn.esprit.esponline.Feign.AuthServiceClient;
import tn.esprit.esponline.Services.CourseService;
import tn.esprit.esponline.Services.IFileStorageService;
import tn.esprit.esponline.Services.PdfGenerationService;
import tn.esprit.esponline.Services.ZipService;
import tn.esprit.esponline.config.JwtService;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Tag(name = "Courses", description = "This web service handles CRUD operations for courses.")
@RestController
@RequestMapping("/courses")
public class CourseRestController {
    private static final Logger log = LoggerFactory.getLogger(CourseRestController.class);

    private final CourseService courseService;
    private final JwtService jwtService;
    private final IFileStorageService fileStorageService;
    private final ZipService zipService;
    private final AuthServiceClient authServiceClient;

    private final PdfGenerationService pdfGenerationService;

    @Autowired
    public CourseRestController(CourseService courseService,
                                JwtService jwtService,
                                IFileStorageService fileStorageService,
                                ZipService zipService,
                                AuthServiceClient authServiceClient,
                                PdfGenerationService pdfGenerationService) {
        this.courseService = courseService;
        this.jwtService = jwtService;
        this.fileStorageService = fileStorageService;
        this.zipService = zipService;
        this.authServiceClient = authServiceClient;
        this.pdfGenerationService = pdfGenerationService;
    }
    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateCoursePdf(@PathVariable int id) {
        try {
            byte[] pdfBytes = pdfGenerationService.generateCoursePdf(id);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=course_" + id + ".pdf")
                    .body(pdfBytes);
        } catch (IOException e) {
            log.error("Failed to generate PDF for course {}", id, e);
            return ResponseEntity.internalServerError().build();
        } catch (IllegalArgumentException e) {
            log.warn("Course not found: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error generating PDF for course {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    @Operation(summary = "Retrieve all courses")
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @Operation(summary = "Get course by ID")
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable int id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @Valid @RequestBody Course course) {
        return ResponseEntity.ok(courseService.addCourse(course, course.getTrainerId()));
    }

    @Operation(summary = "Update course")
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable int id,
            @Valid @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(course, id);
        return ResponseEntity.ok(updatedCourse);
    }

    @Operation(summary = "Delete course")
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable int id) {
        courseService.deleteCourse(id);
    }

    @Operation(summary = "Enroll student in course")
    @PostMapping("/{courseId}/enroll/{studentId}")
    public ResponseEntity<Course> enrollStudent(
            @PathVariable int courseId,
            @PathVariable Integer studentId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Course course = courseService.enrollStudentInCourse(courseId, studentId);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(value = "/{id}/zip", produces = "application/zip")
    public ResponseEntity<byte[]> downloadCourseResourcesZip(@PathVariable int id) {
        try {
            byte[] zipBytes = zipService.createCourseResourcesZip(id);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=course_resources_" + id + ".zip")
                    .body(zipBytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/students")
    public ResponseEntity<List<Integer>> getAllStudentIds(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<Integer> studentIds = authServiceClient.getAllStudentIds();
            return ResponseEntity.ok(studentIds);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{courseId}/students/details")
    public ResponseEntity<List<Map<String, Object>>> getEnrolledStudentsWithDetails(
            @PathVariable int courseId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Course course = courseService.getCourseById(courseId);
            if (course == null || course.getStudentIds() == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<Map<String, Object>> students = course.getStudentIds().stream()
                    .map(studentId -> authServiceClient.getStudentById(studentId))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{courseId}/students/{studentId}")
    public ResponseEntity<Void> removeStudentFromCourse(
            @PathVariable int courseId,
            @PathVariable int studentId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            courseService.removeStudentFromCourse(courseId, studentId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{courseId}/students")
    public ResponseEntity<Set<Integer>> getEnrolledStudents(
            @PathVariable int courseId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(403).build();
        }

        Course course = courseService.getCourseById(courseId);
        return ResponseEntity.ok(
                course != null && course.getStudentIds() != null
                        ? course.getStudentIds()
                        : Set.of()
        );
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentDetails(
            @PathVariable Integer studentId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Map<String, Object> student = authServiceClient.getStudentById(studentId);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/students/details")
    public ResponseEntity<List<Map<String, Object>>> getAllStudentsWithDetails(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<Map<String, Object>> students = authServiceClient.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "Get courses for current user")
    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyCourses(
            @RequestParam Integer userId,
            @RequestParam String userRole) {

        System.out.println("[DEBUG] Received request - userId: " + userId + ", role: " + userRole);
        String normalizedRole = userRole.replaceAll("[\\[\\]]", "");
        System.out.println("[DEBUG] Normalized role: " + normalizedRole);

        List<Course> courses = Collections.emptyList();

        if ("TRAINER".equalsIgnoreCase(normalizedRole)) {
            courses = courseService.getCoursesByTrainer(userId);
            System.out.println("[DEBUG] Found " + courses.size() + " courses for trainer");
        } else if ("STUDENT".equalsIgnoreCase(normalizedRole)) {
            courses = courseService.getCoursesByStudent(userId);
            System.out.println("[DEBUG] Found " + courses.size() + " courses for student");
        }

        return ResponseEntity.ok(courses);
    }

    @Operation(summary = "Search my courses")
    @GetMapping("/my-courses/search")
    public ResponseEntity<Page<Course>> searchMyCourses(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) String category,
            @RequestParam Integer userId,
            @RequestParam String userRole,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        String normalizedRole = userRole.replaceAll("[\\[\\]]", "");
        CategoryEnum categoryEnum = null;

        if (category != null && !category.isEmpty()) {
            try {
                categoryEnum = CategoryEnum.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Handle invalid category
            }
        }

        Page<Course> courses;
        if ("TRAINER".equalsIgnoreCase(normalizedRole)) {
            courses = courseService.searchCoursesByTrainer(searchQuery, categoryEnum, userId, page, size);
        } else {
            courses = courseService.searchCoursesByStudent(searchQuery, categoryEnum, userId, page, size);
        }

        return ResponseEntity.ok(courses);
    }

    @Operation(summary = "Search courses")
    @GetMapping("/search")
    public ResponseEntity<Page<Course>> searchCourses(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        CategoryEnum categoryEnum = null;
        if (category != null && !category.isEmpty()) {
            try {
                categoryEnum = CategoryEnum.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Handle invalid category
            }
        }

        return ResponseEntity.ok(courseService.searchCourses(searchQuery, categoryEnum, page, size));
    }

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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) throws IOException {

        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            String fileUrl = fileStorageService.uploadFile(file);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Delete file")
    @DeleteMapping("/delete-file")
    public ResponseEntity<String> deleteFile(@RequestParam String fileUrl) {
        fileStorageService.deleteFile(fileUrl);
        return ResponseEntity.ok("File deleted successfully");
    }
}
