import api from "./api";

// Apply for leave
export const applyLeave = async (leaveData) => {
  const response = await api.post("/leave-requests", leaveData);
  return response.data;
};

// Get all leave requests
export const getAllLeaveRequests = async () => {
  const response = await api.get("/leave-requests");
  return response.data;
};

// Get leave request by ID
export const getLeaveRequestById = async (id) => {
  const response = await api.get(`/leave-requests/${id}`);
  return response.data;
};

// Get leave requests by employee
export const getLeaveRequestsByEmployee = async (employeeId) => {
  const response = await api.get(`/leave-requests/employee/${employeeId}`);
  return response.data;
};

// Approve leave
export const approveLeave = async (id, approvalData) => {
  const response = await api.put(`/leave-requests/${id}/approve`, approvalData);
  return response.data;
};

// Reject leave
export const rejectLeave = async (id, approvalData) => {
  const response = await api.put(`/leave-requests/${id}/reject`, approvalData);
  return response.data;
};

// Cancel leave
export const cancelLeave = async (id) => {
  const response = await api.delete(`/leave-requests/${id}`);
  return response.data;
};

export const getMyLeaveRequests = async () => {
  const response = await api.get("/leave-requests/my");
  return response.data;
};
