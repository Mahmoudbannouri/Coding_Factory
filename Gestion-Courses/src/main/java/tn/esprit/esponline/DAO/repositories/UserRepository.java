package tn.esprit.esponline.DAO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.esponline.DAO.entities.User;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    List<User> findByRoleName(String role);
}
