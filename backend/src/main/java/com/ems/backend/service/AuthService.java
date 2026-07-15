package com.ems.backend.service;

import com.ems.backend.dto.auth.AuthResponse;
import com.ems.backend.dto.auth.LoginRequest;
import com.ems.backend.dto.auth.RegisterRequest;

public interface AuthService {

    void  register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}
