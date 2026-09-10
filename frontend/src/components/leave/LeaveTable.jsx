import { useState } from "react";
import { toast } from "react-toastify";

import {
  approveLeave,
  rejectLeave,
  cancelLeave,
} from "../../services/leaveService";

function LeaveTable({ leaveRequests, onLeaveUpdated }) {
  const [actionLoading, setActionLoading] = useState(null);

  const userRole = localStorage.getItem("role");

  const isAdminOrHr = userRole === "ADMIN" || userRole === "HR";

  const isEmployeeOrManager = userRole === "EMPLOYEE" || userRole === "MANAGER";

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatLeaveType = (leaveType) => {
    if (!leaveType) {
      return "-";
    }

    return leaveType.charAt(0) + leaveType.slice(1).toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN");
  };

  const handleApprove = async (leave) => {
    const remarks = window.prompt("Enter remarks for approving this leave:");

    if (remarks === null) {
      return;
    }

    if (!remarks.trim()) {
      toast.error("Remarks are required.");
      return;
    }

    try {
      setActionLoading(`approve-${leave.id}`);

      await approveLeave(leave.id, {
        remarks: remarks.trim(),
      });

      toast.success("Leave approved successfully.");

      onLeaveUpdated();
    } catch (error) {
      console.error("Error approving leave:", error);

      const message =
        error.response?.data?.message || "Failed to approve leave.";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (leave) => {
    const remarks = window.prompt("Enter remarks for rejecting this leave:");

    if (remarks === null) {
      return;
    }

    if (!remarks.trim()) {
      toast.error("Remarks are required.");
      return;
    }

    try {
      setActionLoading(`reject-${leave.id}`);

      await rejectLeave(leave.id, {
        remarks: remarks.trim(),
      });

      toast.success("Leave rejected successfully.");

      onLeaveUpdated();
    } catch (error) {
      console.error("Error rejecting leave:", error);

      const message =
        error.response?.data?.message || "Failed to reject leave.";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (leave) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this leave request?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`cancel-${leave.id}`);

      await cancelLeave(leave.id);

      toast.success("Leave request cancelled successfully.");

      onLeaveUpdated();
    } catch (error) {
      console.error("Error cancelling leave:", error);

      const message =
        error.response?.data?.message || "Failed to cancel leave request.";

      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  if (!leaveRequests || leaveRequests.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="text-gray-500">No leave requests found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4 font-semibold text-gray-700">
                Employee
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Leave Type
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Start Date
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                End Date
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">Days</th>

              <th className="px-5 py-4 font-semibold text-gray-700">Reason</th>

              <th className="px-5 py-4 font-semibold text-gray-700">Status</th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Approved By
              </th>

              <th className="px-5 py-4 font-semibold text-gray-700">
                Approved Date
              </th>

              <th className="px-5 py-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {leaveRequests.map((leave) => (
              <tr key={leave.id} className="transition hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="font-medium text-gray-800">
                    {leave.employeeName}
                  </div>

                  <div className="text-xs text-gray-500">
                    {leave.employeeCode}
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {formatLeaveType(leave.leaveType)}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {formatDate(leave.startDate)}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {formatDate(leave.endDate)}
                </td>

                <td className="px-5 py-4 font-medium text-gray-700">
                  {leave.numberOfDays}
                </td>

                <td className="max-w-xs px-5 py-4 text-gray-700">
                  <span className="block truncate" title={leave.reason}>
                    {leave.reason}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      leave.status,
                    )}`}
                  >
                    {leave.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {leave.approvedBy || "-"}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {formatDate(leave.approvedDate)}
                </td>

                <td className="px-5 py-4">
                  {/* ADMIN / HR */}
                  {isAdminOrHr && leave.status === "PENDING" && (
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(leave)}
                        disabled={actionLoading !== null}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading === `approve-${leave.id}`
                          ? "Approving..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(leave)}
                        disabled={actionLoading !== null}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading === `reject-${leave.id}`
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                    </div>
                  )}

                  {/* EMPLOYEE / MANAGER */}
                  {isEmployeeOrManager && leave.status === "PENDING" && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleCancel(leave)}
                        disabled={actionLoading !== null}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading === `cancel-${leave.id}`
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    </div>
                  )}

                  {/* No action */}
                  {leave.status !== "PENDING" && (
                    <div className="text-center">
                      <span className="text-xs text-gray-400">No actions</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveTable;
