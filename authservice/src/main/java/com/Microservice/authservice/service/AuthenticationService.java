package com.Microservice.authservice.service;


import com.Microservice.authservice.dao.request.SignUpRequest;
import com.Microservice.authservice.dao.request.SingninRequest;
import com.Microservice.authservice.dao.request.response.JwtAuthenticationResponse;

public interface AuthenticationService {

    JwtAuthenticationResponse SignUp(SignUpRequest request);
    JwtAuthenticationResponse SignIn(SingninRequest request);



}
