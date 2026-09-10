import api from "./api";

// Get all attendance records
export const getAllAttendance = async () => {
  const response = await api.get("/attendance");
  return response.data;
};

// Get attendance by ID
export const getAttendanceById = async (id) => {
  const response = await api.get(`/attendance/${id}`);
  return response.data;
};

// Get attendance records for a specific employee
export const getAttendanceByEmployee = async (employeeId) => {
  const response = await api.get(`/attendance/employee/${employeeId}`);
  return response.data;
};

// Get attendance records for a specific date
export const getAttendanceByDate = async (attendanceDate) => {
  const response = await api.get(`/attendance/date/${attendanceDate}`);
  return response.data;
};

// Mark new attendance
export const markAttendance = async (attendanceData) => {
  const response = await api.post("/attendance", attendanceData);
  return response.data;
};

// Update attendance
export const updateAttendance = async (id, attendanceData) => {
  const response = await api.put(`/attendance/${id}`, attendanceData);
  return response.data;
};

// Delete attendance
export const deleteAttendance = async (id) => {
  const response = await api.delete(`/attendance/${id}`);
  return response.data;
};
