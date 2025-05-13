package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.partnershipmanagement.dto.UserDto;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.List;
@DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
@Getter
@Setter
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idEntreprise;
    @Column(unique = true, nullable = false)
    String nameEntreprise;
    String addressEntreprise;
    String phoneEntreprise;
    String emailEntreprise;
    String descriptionEntreprise;
    float scoreEntreprise;
    // @JsonIgnore
    // @OneToOne
    // User partner;

    Integer partnerId;

    // For response enrichment only (not saved in DB)
    @Transient
    private UserDto partnerDto;


    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy="entreprise")
    private List<Partnership> partnerships;



}
