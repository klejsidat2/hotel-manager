package com.booking.bookingapi.config;

import com.booking.bookingapi.entity.Role;
import com.booking.bookingapi.entity.User;
import com.booking.bookingapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;

    public AdminSeeder(UserRepository users,
                       PasswordEncoder encoder,
                       @Value("${app.admin.email}") String email,
                       @Value("${app.admin.password}") String password) {
        this.users = users;
        this.encoder = encoder;
        this.email = email.trim().toLowerCase();
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (users.existsByEmail(email)) {
            return;
        }
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail(email);
        admin.setPasswordHash(encoder.encode(password));
        admin.setRole(Role.ADMIN);
        users.save(admin);
    }
}