package com.ems.backend.service.impl;

import com.ems.backend.constant.RoleConstants;
import com.ems.backend.dto.leave.ApplyLeaveRequest;
import com.ems.backend.dto.leave.ApprovalRequest;
import com.ems.backend.dto.leave.LeaveResponse;
import com.ems.backend.entity.LeaveRequest;
import com.ems.backend.entity.User;
import com.ems.backend.enums.LeaveStatus;
import com.ems.backend.exception.BadRequestException;
import com.ems.backend.exception.ResourceNotFoundException;
import com.ems.backend.repository.LeaveRequestRepository;
import com.ems.backend.repository.UserRepository;
import com.ems.backend.service.LeaveRequestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    public LeaveRequestServiceImpl(LeaveRequestRepository leaveRequestRepository, UserRepository userRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
    }




    @Override
    public LeaveResponse applyLeave(
            ApplyLeaveRequest request
    ) {

        validateLeaveRequest(request);

        User employee = getEmployee(
                request.getEmployeeId()
        );

        LeaveRequest leaveRequest = buildLeaveRequest(
                request,
                employee
        );

        LeaveRequest savedLeaveRequest =
                leaveRequestRepository.save(leaveRequest);

        return mapToResponse(savedLeaveRequest);
    }

    @Override
    public List<LeaveResponse> getAllLeaveRequests() {

        return leaveRequestRepository
                .findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public LeaveResponse getLeaveRequestById(Long id) {

        LeaveRequest leaveRequest = getLeaveRequest(id);

        return mapToResponse(leaveRequest);
    }

    @Override
    public List<LeaveResponse> getLeaveRequestsByEmployee(
            Long employeeId
    ) {

        User employee = getEmployee(employeeId);

        return leaveRequestRepository
                .findByEmployeeAndActiveTrue(employee)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public LeaveResponse approveLeave(
            Long leaveRequestId,
            ApprovalRequest request
    ) {

        LeaveRequest leaveRequest = getLeaveRequest(leaveRequestId);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException(
                    "Only pending leave requests can be approved."
            );
        }

        User approver = getApprover(request.getApproverId());

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApprovedDate(LocalDate.now());
        leaveRequest.setRemarks(request.getRemarks());

        LeaveRequest updatedLeave =
                leaveRequestRepository.save(leaveRequest);

        return mapToResponse(updatedLeave);
    }

    @Override
    public LeaveResponse rejectLeave(
            Long leaveRequestId,
            ApprovalRequest request
    ) {

        LeaveRequest leaveRequest = getLeaveRequest(leaveRequestId);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException(
                    "Only pending leave requests can be rejected."
            );
        }

        User approver = getApprover(request.getApproverId());

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApprovedDate(LocalDate.now());
        leaveRequest.setRemarks(request.getRemarks());

        LeaveRequest updatedLeave =
                leaveRequestRepository.save(leaveRequest);

        return mapToResponse(updatedLeave);
    }


    @Override
    public void cancelLeave(Long leaveRequestId) {

        LeaveRequest leaveRequest = getLeaveRequest(leaveRequestId);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException(
                    "Only pending leave requests can be cancelled."
            );
        }

        leaveRequest.setActive(false);

        leaveRequestRepository.save(leaveRequest);
    }

    private User getEmployee(Long employeeId) {

        return userRepository
                .findByIdAndActiveTrueAndRole_NameIn(
                        employeeId,
                        List.of(RoleConstants.EMPLOYEE,RoleConstants.MANAGER)
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + employeeId
                        )
                );
    }

    private LeaveRequest getLeaveRequest(Long id) {

        return leaveRequestRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave request not found with id: " + id
                        )
                );
    }

    private User getApprover(Long approverId) {

        return userRepository
                .findByIdAndActiveTrueAndRole_NameIn(
                        approverId,
                        List.of(
                                RoleConstants.ADMIN,
                                RoleConstants.HR,
                                RoleConstants.MANAGER
                        )
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Approver not found with id: " + approverId
                        )
                );
    }
    private Integer calculateLeaveDays(
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (startDate.isAfter(endDate)) {
            throw new BadRequestException(
                    "Start date cannot be after end date."
            );
        }
        return (int) ChronoUnit.DAYS.between(
                startDate,
                endDate
        ) + 1;
    }

    private LeaveResponse mapToResponse(LeaveRequest leaveRequest) {

        LeaveResponse response = new LeaveResponse();

        response.setId(leaveRequest.getId());

        response.setEmployeeName(
                leaveRequest.getEmployee().getFirstName()
                        + " "
                        + leaveRequest.getEmployee().getLastName()
        );

        response.setEmployeeCode(
                leaveRequest.getEmployee().getEmployeeCode()
        );

        response.setLeaveType(
                leaveRequest.getLeaveType()
        );

        response.setStartDate(
                leaveRequest.getStartDate()
        );

        response.setEndDate(
                leaveRequest.getEndDate()
        );

        response.setNumberOfDays(
                leaveRequest.getNumberOfDays()
        );

        response.setReason(
                leaveRequest.getReason()
        );

        response.setStatus(
                leaveRequest.getStatus()
        );

        response.setApprovedBy(
                leaveRequest.getApprovedBy() != null
                        ? leaveRequest.getApprovedBy().getFirstName()
                        + " "
                        + leaveRequest.getApprovedBy().getLastName()
                        : null
        );

        response.setApprovedDate(
                leaveRequest.getApprovedDate()
        );

        response.setRemarks(
                leaveRequest.getRemarks()
        );

        return response;
    }

    private void validateLeaveRequest(
            ApplyLeaveRequest request
    ) {

        if (request.getStartDate().isAfter(request.getEndDate())) {

            throw new BadRequestException(
                    "Start date cannot be after end date."
            );
        }

    }

    private LeaveRequest buildLeaveRequest(
            ApplyLeaveRequest request,
            User employee
    ) {

        LeaveRequest leaveRequest = new LeaveRequest();

        leaveRequest.setEmployee(employee);
        leaveRequest.setLeaveType(request.getLeaveType());
        leaveRequest.setStartDate(request.getStartDate());
        leaveRequest.setEndDate(request.getEndDate());

        leaveRequest.setNumberOfDays(
                calculateLeaveDays(
                        request.getStartDate(),
                        request.getEndDate()
                )
        );

        leaveRequest.setReason(request.getReason());

        leaveRequest.setStatus(LeaveStatus.PENDING);

        return leaveRequest;
    }
}
