package com.PIDEV.Auth.Service.Dto;
import com.PIDEV.Auth.Service.Entity.Role;
import lombok.Data;

import java.util.Date;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private Date dateOfBirth;
    private Role role;
}
