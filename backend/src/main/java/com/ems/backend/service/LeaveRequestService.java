package com.ems.backend.service;

import com.ems.backend.dto.leave.ApplyLeaveRequest;
import com.ems.backend.dto.leave.ApprovalRequest;
import com.ems.backend.dto.leave.LeaveResponse;

import java.util.List;

public interface LeaveRequestService {

    LeaveResponse applyLeave(
            ApplyLeaveRequest request
    );

    List<LeaveResponse> getAllLeaveRequests();

    LeaveResponse getLeaveRequestById(
            Long id
    );

    List<LeaveResponse> getLeaveRequestsByEmployee(
            Long employeeId
    );

    LeaveResponse approveLeave(
            Long leaveRequestId,
            ApprovalRequest request
    );

    LeaveResponse rejectLeave(
            Long leaveRequestId,
            ApprovalRequest request
    );

    void cancelLeave(
            Long leaveRequestId
    );
}