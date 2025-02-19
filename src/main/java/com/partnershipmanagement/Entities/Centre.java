package com.partnershipmanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Centre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idCentre;  // Fixed variable name convention

    String name;
    String description;

    @ManyToOne
    User admin;
    @OneToMany(mappedBy = "centre", cascade = CascadeType.ALL)
    List<Partnership> partnerships;

}
