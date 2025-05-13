package com.Microservice.authservice.dao.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentPerformanceRequest {
    @NotNull
    @Min(15) @Max(22)
    private Integer age;

    @NotBlank
    private String school;

    @NotBlank
    private String sex;
    private String address;
    private String famsize;
    private String Pstatus;
    private Integer Medu;
    private Integer Fedu;
    private String Mjob;
    private String Fjob;
    private String reason;
    private String guardian;
    private Integer traveltime;
    private Integer studytime;
    private Integer failures;
    private String schoolsup;
    private String famsup;
    private String paid;
    private String activities;
    private String nursery;
    private String higher;
    private String internet;
    private String romantic;
    private Integer famrel;
    private Integer freetime;
    private Integer goout;
    private Integer Dalc;
    private Integer Walc;
    private Integer health;
    private Integer absences;
    @NotNull @DecimalMin("0") @DecimalMax("20")
    private Double G1;

    @NotNull @DecimalMin("0") @DecimalMax("20")
    private Double G2;
}
