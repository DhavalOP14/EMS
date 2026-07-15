package com.ems.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('MANAGER')")
    public String dashboard() {
        return "Welcome Manager";
    }
}