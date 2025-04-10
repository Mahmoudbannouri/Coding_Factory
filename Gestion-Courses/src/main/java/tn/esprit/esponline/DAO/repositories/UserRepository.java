package tn.esprit.esponline.DAO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.esponline.DAO.entities.RoleNameEnum;
import tn.esprit.esponline.DAO.entities.User;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.role.name = :roleName")
    List<User> findByRoleName(@Param("roleName") RoleNameEnum roleName);
    List<User> findByRoleName(String role);
}
