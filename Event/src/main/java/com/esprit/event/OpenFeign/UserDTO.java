package com.esprit.event.OpenFeign;

import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private Date dateOfBirth;
    private Set<String> roles;
}
