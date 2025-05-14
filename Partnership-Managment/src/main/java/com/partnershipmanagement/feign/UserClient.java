package com.partnershipmanagement.feign;

import com.partnershipmanagement.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@FeignClient(name = "authservice", url = "http://localhost:8887")
public interface UserClient {

    // Partner endpoints
    @GetMapping("/api/v1/auth/partners")
    List<UserDTO> getAllPartners();

    @GetMapping("/api/v1/auth/partners/ids")
    List<Integer> getAllPartnerIds();

    @GetMapping("/api/v1/auth/partners/{id}")
    UserDTO getPartnerById(@PathVariable("id") Integer id);

    // Admin endpoints
    @GetMapping("/api/v1/auth/admins")
    List<UserDTO> getAllAdmins();

    @GetMapping("/api/v1/auth/admins/ids")
    List<Integer> getAllAdminIds();

    @GetMapping("/api/v1/auth/admins/{id}")
    UserDTO getAdminById(@PathVariable("id") Integer id);
}
