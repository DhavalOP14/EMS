package com.ems.backend.controller;

import com.ems.backend.entity.User;
import com.ems.backend.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @GetMapping("/me")
    public String me(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        User user = userDetails.getUser();

        return "Welcome "
                + user.getFirstName()
                + " ("
                + user.getRole().getName()
                + ")";
    }
}