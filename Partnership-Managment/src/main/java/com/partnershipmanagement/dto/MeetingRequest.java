package com.partnershipmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//seperateir class for the zoom api if ididnt use params
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeetingRequest {
    private String topic;
    private String startTime;
    private String duration;
}
