package com.ems.backend.dto.leave;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ApprovalRequest {


    @NotBlank(message = "Remarks are required.")
    @Size(max = 500)
    private String remarks;

    public ApprovalRequest() {
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}