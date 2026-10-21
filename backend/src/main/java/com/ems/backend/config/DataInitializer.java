package com.ems.backend.config;

import com.ems.backend.constant.RoleConstants;
import com.ems.backend.entity.Role;
import com.ems.backend.entity.User;
import com.ems.backend.repository.RoleRepository;
import com.ems.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedDefaultAdmin();
    }

    private void seedRoles() {
        List<String> roles = List.of(
                RoleConstants.ADMIN,
                RoleConstants.HR,
                RoleConstants.MANAGER,
                RoleConstants.EMPLOYEE
        );

        for (String roleName : roles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(new Role(roleName));
                System.out.println("Seeded role: " + roleName);
            }
        }
    }

    private void seedDefaultAdmin() {
        String adminEmail = "admin@ems.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            Role adminRole = roleRepository.findByName(RoleConstants.ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(RoleConstants.ADMIN)));

            User admin = new User();
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            // Password hashed using Spring Security's PasswordEncoder
            admin.setPassword(passwordEncoder.encode("Admin@1234"));
            admin.setRole(adminRole);
            admin.setActive(true);
            admin.setEmployeeCode("EMP-ADMIN");

            userRepository.save(admin);
            System.out.println("Seeded default admin user: " + adminEmail);
        }
    }
}