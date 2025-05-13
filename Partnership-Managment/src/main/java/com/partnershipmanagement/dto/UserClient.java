package com.partnershipmanagement.dto;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "authservice")
public interface UserClient {
    @GetMapping("/api/v1/auth/user/{id}")
    UserDto getUserById(@PathVariable("id") Integer id);
}
