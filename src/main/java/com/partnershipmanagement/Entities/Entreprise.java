package com.partnershipmanagement.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idEntreprise;
    String nameEntreprise;
    String addressEntreprise;
    String phoneEntreprise;
    String emailEntreprise;
    String descriptionEntreprise;

    @OneToOne
    User partner;
    @OneToMany(mappedBy = "entreprise", cascade = CascadeType.ALL)
    List<Partnership> partnerships;

}
