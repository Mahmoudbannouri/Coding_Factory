package tn.esprit.esponline.Services;

import tn.esprit.esponline.DAO.entities.User;
import java.util.List;

public interface IUserService {
    List<User> getAllUsers();
    User addUser(User user);
    void deleteUserById(int id);
    void updateUserEmail(int id, String email);
    List<User> getUsersByRole(String role);
}
