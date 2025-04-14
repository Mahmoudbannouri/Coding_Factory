package com.esprit.event.OpenFeign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "gestion-partnership", url = "http://localhost:8090")
public interface CenterClient {
    @GetMapping("/Partnership/api/centers/all")
    List<CenterDTO> getAllCenters(); // To fetch all centers

    @GetMapping("/Partnership/api/centers/getCenterById/{id}")
    CenterDTO getCenterById(@PathVariable("id") int id); // To fetch a center by ID
}
