package com.PIDEV.Auth.Service.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private Date dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Role role;
}
