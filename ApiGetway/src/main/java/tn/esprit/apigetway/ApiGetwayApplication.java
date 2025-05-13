package tn.esprit.apigetway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;

@EnableDiscoveryClient
@SpringBootApplication
public class ApiGetwayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGetwayApplication.class, args);
    }

    // Dynamic configuration for multiple routes
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route for gestion-pfe service
                .route("gestion-pfe", r -> r.path("/pfe/**")
                        .uri("lb://GESTION-PFE"))  // Ensure this matches the Eureka service name
                // Route for gestion-course service
                .route("gestion-course", r -> r.path("/gestion-course/**")
                        .uri("lb://gestion-course"))  // Ensure this matches the Eureka service name
                // Route for gestion-reviews service
                .route("event-service", r -> r.path("/event/**")
                        .uri("lb://EVENT-SERVICE"))
                .route("gestion-reviews", r -> r.path("/reviews/**")
                        .uri("lb://reviews-service"))  // Ensure this matches the Eureka service name
                .route("auth", r -> r.path("/api/v1/auth/**","/api/v1/auth/password/**", "/api/v1/auth/verify", "/api/v1/auth/resend-verification","/api/v1/auth/users","/api/v1/auth/users/**","/api/v1/auth/users/*/enable",
                                "/api/v1/auth/users/*/disable","/api/v1/performance/**")
                        .uri("lb://authservice")) // Ensure this matches the Eureka service name
                .route("gestion-partnership", r -> r.path("/Partnership/**")
                        .uri("lb://PARTNERSHIPMANAGEMENT"))
                .route("gestion-exam", r -> r.path("/exam/**")
                        .uri("lb://EXAM-SERVICE"))
                // Route for student-performance-service
                .route("student-performance-service", r -> r.path("/api/v1/performance/**")
                        .uri("lb://student-performance-service"))  // Ensure this matches the Eureka service name
                .build();
        // Only one .build() is needed
    }
}