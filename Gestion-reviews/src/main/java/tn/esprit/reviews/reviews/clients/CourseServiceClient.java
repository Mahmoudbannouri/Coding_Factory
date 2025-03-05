    package tn.esprit.reviews.reviews.clients;

    import org.springframework.cloud.openfeign.FeignClient;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.PathVariable;
    import org.springframework.web.bind.annotation.PutMapping;
    import org.springframework.web.bind.annotation.RequestBody;

    @FeignClient(name = "gestion-course", url = "http://localhost:8081")
    public interface CourseServiceClient {

        @PutMapping("/courses/{id}/update-rate")
        void updateCourseRate(@PathVariable int id, @RequestBody double rate);


        @GetMapping("/courses/{id}/title")
        String getCourseTitle(@PathVariable int id);
    }