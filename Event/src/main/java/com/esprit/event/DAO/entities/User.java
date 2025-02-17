package com.esprit.event.DAO.entities;
import jakarta.persistence.*;
import lombok.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;
import java.util.Set;

@Entity


@Getter
@Setter


public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String email;
    private String passwordHash;
    private String phoneNumber;
    private String address;
    private java.sql.Date dateOfBirth;

    @ManyToOne

    private Role role;


}
