package tn.esprit.gestion_pfe.Client;

import org.springframework.stereotype.Component;
import tn.esprit.gestion_pfe.DAO.entities.UserDto;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component

public class UserServiceClientFallback implements UserServiceClient{

    @Override
    public List<Integer> getAllStudentIds() {
        return Collections.emptyList();
    }

    @Override
    public List<UserDto> getAllStudents() {
        return Collections.emptyList();
    }

    @Override
    public UserDto getStudentById(Integer id) {
        return new UserDto();
    }

    @Override
    public List<Integer> getAllTrainerIds() {
        return Collections.emptyList();
    }

    @Override
    public List<UserDto> getAllTrainers() {
        return Collections.emptyList();
    }

    @Override
    public UserDto getTrainerById(Integer id) {
        return new UserDto();
    }

    @Override
    public List<Integer> getAllPartnerIds() {
        return Collections.emptyList();
    }

    @Override
    public List<UserDto> getAllPartners() {
        return Collections.emptyList();
    }

    @Override
    public UserDto getPartnerById(Integer id) {
        return new UserDto();
    }
}
