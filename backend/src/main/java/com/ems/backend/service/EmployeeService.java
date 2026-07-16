package com.ems.backend.service;

import com.ems.backend.dto.employee.EmployeeRequest;
import com.ems.backend.dto.employee.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(EmployeeRequest request);

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(Long id);

    EmployeeResponse updateEmployee(Long id,
                                    EmployeeRequest request);

    void deleteEmployee(Long id);
}