package com.partnershipmanagement.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idEntreprise;
    String nameEntreprise;
    String addressEntreprise;
    String phoneEntreprise;
    String emailEntreprise;
    String descriptionEntreprise;
    @JsonIgnore
    @OneToOne
    User partner;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy="entreprise")
    private List<Partnership> partnerships;

    public int getIdEntreprise() {
        return idEntreprise;
    }

    public void setIdEntreprise(int idEntreprise) {
        this.idEntreprise = idEntreprise;
    }

    public String getNameEntreprise() {
        return nameEntreprise;
    }

    public void setNameEntreprise(String nameEntreprise) {
        this.nameEntreprise = nameEntreprise;
    }

    public String getAddressEntreprise() {
        return addressEntreprise;
    }

    public void setAddressEntreprise(String addressEntreprise) {
        this.addressEntreprise = addressEntreprise;
    }

    public String getPhoneEntreprise() {
        return phoneEntreprise;
    }

    public void setPhoneEntreprise(String phoneEntreprise) {
        this.phoneEntreprise = phoneEntreprise;
    }

    public String getEmailEntreprise() {
        return emailEntreprise;
    }

    public void setEmailEntreprise(String emailEntreprise) {
        this.emailEntreprise = emailEntreprise;
    }

    public String getDescriptionEntreprise() {
        return descriptionEntreprise;
    }

    public void setDescriptionEntreprise(String descriptionEntreprise) {
        this.descriptionEntreprise = descriptionEntreprise;
    }

    public User getPartner() {
        return partner;
    }

    public void setPartner(User partner) {
        this.partner = partner;
    }

    public List<Partnership> getPartnerships() {
        return partnerships;
    }

    public void setPartnerships(ArrayList<Partnership> partnerships) {
        this.partnerships = partnerships;
    }

    @Override
    public String toString() {
        return "Entreprise{" +
                "idEntreprise=" + idEntreprise +
                ", nameEntreprise='" + nameEntreprise + '\'' +
                ", addressEntreprise='" + addressEntreprise + '\'' +
                ", phoneEntreprise='" + phoneEntreprise + '\'' +
                ", emailEntreprise='" + emailEntreprise + '\'' +
                ", descriptionEntreprise='" + descriptionEntreprise + '\'' +
                ", partner=" + partner +
                ", partnerships=" + partnerships +
                '}';
    }
}