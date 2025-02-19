package com.partnershipmanagement.Repositories;

import com.partnershipmanagement.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {
}
