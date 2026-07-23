package com.ems.backend.dto.leave;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ApprovalRequest {

    @NotNull(message = "Approver id is required.")
    private Long approverId;

    @NotBlank(message = "Remarks are required.")
    @Size(max = 500)
    private String remarks;

    public ApprovalRequest() {
    }

    public Long getApproverId() {
        return approverId;
    }

    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}