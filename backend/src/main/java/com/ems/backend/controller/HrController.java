package com.ems.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('HR')")
    public String dashboard() {
        return "Welcome HR";
    }
}
