package com.ems.backend.service;

import com.ems.backend.dto.employee.CreateEmployeeRequest;
import com.ems.backend.dto.employee.EmployeeResponse;
import com.ems.backend.dto.employee.UpdateEmployeeRequest;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(CreateEmployeeRequest request);

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(Long id);

    EmployeeResponse updateEmployee(Long id,
                                    UpdateEmployeeRequest request);

    void deleteEmployee(Long id);
}