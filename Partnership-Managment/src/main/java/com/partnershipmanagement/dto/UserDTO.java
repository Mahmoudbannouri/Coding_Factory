package com.partnershipmanagement.dto;

import lombok.*;

import java.sql.Date;
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
