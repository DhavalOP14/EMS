package com.ems.backend.controller;

import com.ems.backend.dto.leave.ApplyLeaveRequest;
import com.ems.backend.dto.leave.ApprovalRequest;
import com.ems.backend.dto.leave.LeaveResponse;
import com.ems.backend.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(
            LeaveRequestService leaveRequestService
    ) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<LeaveResponse> applyLeave(
            @Valid @RequestBody ApplyLeaveRequest request
    ) {

        LeaveResponse response =
                leaveRequestService.applyLeave(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<LeaveResponse>> getAllLeaveRequests() {

        return ResponseEntity.ok(
                leaveRequestService.getAllLeaveRequests()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponse> getLeaveRequestById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                leaveRequestService.getLeaveRequestById(id)
        );
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveResponse>> getLeaveRequestsByEmployee(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                leaveRequestService.getLeaveRequestsByEmployee(employeeId)
        );
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveResponse> approveLeave(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequest request
    ) {

        return ResponseEntity.ok(
                leaveRequestService.approveLeave(id, request)
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveResponse> rejectLeave(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequest request
    ) {

        return ResponseEntity.ok(
                leaveRequestService.rejectLeave(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelLeave(
            @PathVariable Long id
    ) {

        leaveRequestService.cancelLeave(id);

        return ResponseEntity.noContent().build();
    }

}