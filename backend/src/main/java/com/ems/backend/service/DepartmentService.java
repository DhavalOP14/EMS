package com.ems.backend.service;

import com.ems.backend.dto.department.DepartmentRequest;
import com.ems.backend.dto.department.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse createDepartment(DepartmentRequest request);

    List<DepartmentResponse> getAllDepartments();

    DepartmentResponse getDepartmentById(Long id);

    DepartmentResponse updateDepartment(
            Long id,
            DepartmentRequest request
    );

    void deleteDepartment(Long id);
}