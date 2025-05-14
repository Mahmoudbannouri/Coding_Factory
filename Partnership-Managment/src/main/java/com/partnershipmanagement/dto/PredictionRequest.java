package com.partnershipmanagement.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {
    private double ratings;
    private int review_count;
    private String keywords;
}
