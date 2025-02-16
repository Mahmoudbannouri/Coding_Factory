package tn.esprit.esponline.DAO.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.esponline.DAO.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}