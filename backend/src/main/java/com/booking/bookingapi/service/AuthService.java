package com.booking.bookingapi.service;

import com.booking.bookingapi.dto.LoginRequest;
import com.booking.bookingapi.dto.LoginResponse;
import com.booking.bookingapi.entity.User;
import com.booking.bookingapi.exception.UnauthorizedException;
import com.booking.bookingapi.repository.UserRepository;
import com.booking.bookingapi.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public LoginResponse login(LoginRequest req) {
        User user = users.findByEmail(req.email().trim().toLowerCase())
                .filter(u -> encoder.matches(req.password(), u.getPasswordHash()))
                .orElseThrow(() -> new UnauthorizedException("Email ose fjalëkalim i gabuar"));

        return new LoginResponse(jwt.generate(user), user.getName(), user.getEmail(), user.getRole().name());
    }
}