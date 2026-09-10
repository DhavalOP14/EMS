import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

import { applyLeave } from "../../services/leaveService";

const leaveTypes = [
  { id: "CASUAL", name: "Casual" },
  { id: "SICK", name: "Sick" },
  { id: "EARNED", name: "Earned" },
  { id: "UNPAID", name: "Unpaid" },
];

function LeaveForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.leaveType) {
      validationErrors.leaveType = "Please select a leave type.";
    }

    if (!formData.startDate) {
      validationErrors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      validationErrors.endDate = "End date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      validationErrors.endDate =
        "End date must be after or equal to start date.";
    }

    if (!formData.reason.trim()) {
      validationErrors.reason = "Reason is required.";
    } else if (formData.reason.trim().length > 500) {
      validationErrors.reason = "Reason cannot exceed 500 characters.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const leaveData = {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
      };

      await applyLeave(leaveData);

      toast.success("Leave application submitted successfully!");

      navigate("/leave-requests");
    } catch (error) {
      console.error("Error applying leave:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      const message =
        error.response?.data?.message || "Failed to submit leave application.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/leave-requests");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Apply for Leave</h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the leave information below.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SelectField
            label="Leave Type"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            options={leaveTypes}
            error={errors.leaveType}
            required
          />

          <InputField
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
          />

          <InputField
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            required
          />

          <InputField
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Enter reason for leave"
            error={errors.reason}
            required
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
            {loading ? "Submitting..." : "Apply for Leave"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeaveForm;
