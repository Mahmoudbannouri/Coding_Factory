package com.partnershipmanagement.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PredictionResponse {
    private boolean eligible;
    private double probability;
    //private String percentage;
}
