package com.partnershipmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
//import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


//@EnableDiscoveryClient
@SpringBootApplication
@EnableScheduling

public class PartnershipManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PartnershipManagementApplication.class, args);
    }
}