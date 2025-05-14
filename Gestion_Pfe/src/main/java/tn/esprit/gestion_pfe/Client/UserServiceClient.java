package tn.esprit.gestion_pfe.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.gestion_pfe.DAO.entities.UserDto;

import java.util.List;
import java.util.Map;

@FeignClient(
        name = "user-service",
        url = "http://localhost:8887/api/v1/auth",
        fallback = UserServiceClientFallback.class
)
public interface UserServiceClient {

    @GetMapping("/students/ids")
    List<Integer> getAllStudentIds();

    @GetMapping("/students")
    List<UserDto> getAllStudents();

    @GetMapping("/students/{id}")
    UserDto getStudentById(@PathVariable Integer id);


    @GetMapping("/trainers/ids")
    List<Integer> getAllTrainerIds();

    @GetMapping("/trainers")
    List<UserDto> getAllTrainers();

    @GetMapping("/trainers/{id}")
    UserDto getTrainerById(@PathVariable Integer id);


    @GetMapping("/partners/ids")
    List<Integer> getAllPartnerIds();

    @GetMapping("/partners")
    List<UserDto> getAllPartners();

    @GetMapping("/partners/{id}")
    UserDto getPartnerById(@PathVariable Integer id);
}
