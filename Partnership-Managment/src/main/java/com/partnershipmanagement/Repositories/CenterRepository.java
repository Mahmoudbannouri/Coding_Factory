package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CenterRepository extends JpaRepository<Center, Integer> {
    @Query("SELECT c FROM Center c WHERE c.nameCenter = :nameCenter")
    Center findByName(@Param("nameCenter") String name);
}
