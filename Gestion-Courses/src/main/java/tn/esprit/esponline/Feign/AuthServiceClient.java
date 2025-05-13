package tn.esprit.esponline.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@FeignClient(name = "auth-service", url = "http://localhost:8090")
public interface AuthServiceClient {

    @GetMapping("/api/v1/auth/students/ids")
    List<Integer> getAllStudentIds();

    @GetMapping("/api/v1/auth/students")
    List<Map<String, Object>> getAllStudents();

    @GetMapping("/api/v1/auth/students/{id}")
    Map<String, Object> getStudentById(@PathVariable Integer id);
}