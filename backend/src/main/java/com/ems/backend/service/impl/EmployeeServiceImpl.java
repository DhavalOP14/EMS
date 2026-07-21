package com.ems.backend.service.impl;

import com.ems.backend.constant.RoleConstants;
import com.ems.backend.dto.employee.CreateEmployeeRequest;
import com.ems.backend.dto.employee.EmployeeResponse;
import com.ems.backend.dto.employee.UpdateEmployeeRequest;
import com.ems.backend.entity.Department;
import com.ems.backend.entity.Role;
import com.ems.backend.entity.User;
import com.ems.backend.exception.DuplicateResourceException;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.DepartmentRepository;
import com.ems.backend.repository.RoleRepository;
import com.ems.backend.repository.UserRepository;
import com.ems.backend.service.EmployeeService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImpl(UserRepository userRepository, RoleRepository roleRepository, DepartmentRepository departmentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already exists."
            );
        }

        Role role = getRole(request.getRoleId());

        Department department = getDepartment(
                request.getDepartmentId()
        );

        User manager = getManager(
                request.getManagerId()
        );

        User user = buildEmployee(
                request,
                role,
                department,
                manager
        );

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }


    @Override
    public List<EmployeeResponse> getAllEmployees() {

        List<String> employeeRoles = List.of(
                RoleConstants.MANAGER,
                RoleConstants.EMPLOYEE
        );

        return userRepository
                .findByActiveTrueAndRole_NameIn(employeeRoles)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {

       User employee = getEmployee(id);
        return mapToResponse(employee);
    }


    @Override
    public EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request) {

        // Fetch existing employee
        User employee = getEmployee(id);

        // Check if email already exists for another user
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()
                && !existingUser.get().getId().equals(employee.getId())) {

            throw new DuplicateResourceException(
                    "Email already exists."
            );
        }

        // Fetch related entities
        Role role = getRole(request.getRoleId());

        Department department = getDepartment(request.getDepartmentId());

        User manager = getManager(request.getManagerId());

        // Update employee fields
        updateEmployeeFields(
                employee,
                request,
                role,
                department,
                manager
        );

        // Save updated employee
        User updatedEmployee = userRepository.save(employee);

        return mapToResponse(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {

        User employee = getEmployee(id);

        employee.setActive(false);

        userRepository.save(employee);
    }

    private EmployeeResponse mapToResponse(User user) {

        EmployeeResponse response = new EmployeeResponse();

        response.setId(user.getId());
        response.setEmployeeCode(user.getEmployeeCode());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        response.setRole(user.getRole().getName());

        response.setDepartment(
                user.getDepartment() != null
                        ? user.getDepartment().getName()
                        : null
        );

        response.setManager(
                user.getManager() != null
                        ? user.getManager().getFirstName() + " "
                        + user.getManager().getLastName()
                        : null
        );

        response.setDesignation(user.getDesignation());
        response.setSalary(user.getSalary());
        response.setJoiningDate(user.getJoiningDate());
        response.setActive(user.getActive());

        return response;
    }

    private User getEmployee(Long id) {

        return userRepository
                .findByIdAndActiveTrueAndRole_NameIn(
                        id,
                        List.of(RoleConstants.MANAGER,RoleConstants.EMPLOYEE)
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id
                        )
                );
    }


    private Role getRole(Integer roleId) {

        return roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found with id: " + roleId
                        )
                );
    }

    private Department getDepartment(Long departmentId) {

        return departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with id: "
                                        + departmentId
                        )
                );
    }

    private User getManager(Long managerId) {

        if (managerId == null) {
            return null;
        }

        return userRepository.findByIdAndActiveTrueAndRole_NameIn(managerId , List.of(RoleConstants.MANAGER))
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Manager not found with id: "
                                        + managerId
                        )
                );
    }
    private String generateEmployeeCode() {
        return "EMP" + System.currentTimeMillis();
    }

    private void updateEmployeeFields(
            User employee,
            UpdateEmployeeRequest request,
            Role role,
            Department department,
            User manager
    ) {

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());

        employee.setRole(role);
        employee.setDepartment(department);
        employee.setManager(manager);
    }

    private User buildEmployee(
            CreateEmployeeRequest request,
            Role role,
            Department department,
            User manager
    ) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setPhone(request.getPhone());
        user.setDesignation(request.getDesignation());
        user.setSalary(request.getSalary());
        user.setJoiningDate(request.getJoiningDate());

        user.setRole(role);
        user.setDepartment(department);
        user.setManager(manager);

        user.setEmployeeCode(generateEmployeeCode());

        return user;
    }
}
