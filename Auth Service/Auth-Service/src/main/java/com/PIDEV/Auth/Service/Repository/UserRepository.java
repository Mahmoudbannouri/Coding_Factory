package com.PIDEV.Auth.Service.Repository;

import com.PIDEV.Auth.Service.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
}
