import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

import {
  markAttendance,
  updateAttendance,
} from "../../services/attendanceSevice";

import { getAllEmployees } from "../../services/employeeService";

const attendanceStatuses = [
  { id: "PRESENT", name: "Present" },
  { id: "ABSENT", name: "Absent" },
  { id: "HALF_DAY", name: "Half Day" },
  { id: "LEAVE", name: "Leave" },
  { id: "HOLIDAY", name: "Holiday" },
];

function AttendanceForm({ attendance = null, isEdit = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    attendanceDate: "",
    checkIn: "",
    checkOut: "",
    status: "",
    remarks: "",
  });

  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  /*
   * Load employees for the employee dropdown.
   */
  const loadEmployees = async () => {
    try {
      setLoadingData(true);

      const employeeData = await getAllEmployees();
      const employeeOptions = employeeData.map((employee) => ({
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName} (${employee.employeeCode})`,
      }));
      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Error loading employees:", error);

      const message =
        error.response?.data?.message || "Failed to load employees.";

      toast.error(message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /*
   * Populate form when editing an existing attendance record.
   */
  useEffect(() => {
    if (isEdit && attendance) {
      setFormData({
        employeeId: attendance.employeeId?.toString() || "",
        attendanceDate: attendance.attendanceDate || "",
        checkIn: attendance.checkIn ? attendance.checkIn.substring(0, 5) : "",
        checkOut: attendance.checkOut
          ? attendance.checkOut.substring(0, 5)
          : "",
        status: attendance.status || "",
        remarks: attendance.remarks || "",
      });
    }
  }, [isEdit, attendance]);

  /*
   * Handles input/select changes.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  /*
   * Client-side validation.
   */
  const validateForm = () => {
    const validationErrors = {};

    if (!formData.employeeId) {
      validationErrors.employeeId = "Please select an employee.";
    }

    if (!formData.attendanceDate) {
      validationErrors.attendanceDate = "Attendance date is required.";
    }

    if (!formData.status) {
      validationErrors.status = "Please select attendance status.";
    }

    /*
     * Check-out should not be before check-in.
     */
    if (formData.checkIn && formData.checkOut) {
      if (formData.checkOut <= formData.checkIn) {
        validationErrors.checkOut =
          "Check-out time must be after check-in time.";
      }
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /*
   * Create or update attendance.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const attendanceData = {
        employeeId: Number(formData.employeeId),
        attendanceDate: formData.attendanceDate,
        checkIn: formData.checkIn || null,
        checkOut: formData.checkOut || null,
        status: formData.status,
        remarks: formData.remarks.trim() || null,
      };

      if (isEdit) {
        await updateAttendance(attendance.id, attendanceData);

        toast.success("Attendance updated successfully!");
      } else {
        await markAttendance(attendanceData);

        toast.success("Attendance marked successfully!");
      }

      navigate("/attendance");
    } catch (error) {
      console.error(
        isEdit ? "Error updating attendance:" : "Error marking attendance:",
        error,
      );

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      const message =
        error.response?.data?.message ||
        (isEdit
          ? "Failed to update attendance."
          : "Failed to mark attendance.");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/attendance");
  };

  if (loadingData) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500">Loading attendance form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Attendance" : "Mark Attendance"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update the attendance information below."
            : "Enter the attendance information below."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SelectField
            label="Employee"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            options={employees}
            error={errors.employeeId}
            required
          />

          <InputField
            label="Attendance Date"
            type="date"
            name="attendanceDate"
            value={formData.attendanceDate}
            onChange={handleChange}
            error={errors.attendanceDate}
            required
          />

          <InputField
            label="Check In"
            type="time"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            error={errors.checkIn}
          />

          <InputField
            label="Check Out"
            type="time"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            error={errors.checkOut}
          />

          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={attendanceStatuses}
            error={errors.status}
            required
          />

          <InputField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Enter remarks (optional)"
            error={errors.remarks}
          />
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEdit
                ? "Update Attendance"
                : "Mark Attendance"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AttendanceForm;
