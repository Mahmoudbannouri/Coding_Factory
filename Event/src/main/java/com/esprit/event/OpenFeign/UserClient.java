package com.esprit.event.OpenFeign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service", url = "http://localhost:8090")
public interface UserClient {


    @GetMapping("/api/v1/auth/user/{id}")
    UserDTO getUserById(@PathVariable("id") Integer id);
}
