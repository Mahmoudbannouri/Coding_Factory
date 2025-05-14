package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,Integer> {
    @Query("SELECT u FROM User u WHERE u.cin = :cin")
    User findByCin(@Param("cin") String cin);
}
