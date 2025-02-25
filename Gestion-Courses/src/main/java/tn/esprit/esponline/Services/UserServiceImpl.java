package tn.esprit.esponline.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.esponline.DAO.entities.User;
import tn.esprit.esponline.DAO.repositories.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User addUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUserById(int id) {
        userRepository.deleteById(id);
    }

    @Override
    public void updateUserEmail(int id, String email) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setEmail(email);
            userRepository.save(user);
        }
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRoleName(role);
    }
}
