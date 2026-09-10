import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteAttendance } from "../../services/attendanceSevice";

function AttendanceTable({ attendance, onAttendanceDeleted }) {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAttendance(id);

      toast.success("Attendance deleted successfully.");

      onAttendanceDeleted();
    } catch (error) {
      console.error("Error deleting attendance:", error);

      const message =
        error.response?.data?.message || "Failed to delete attendance.";

      toast.error(message);
    }
  };

  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    return time.substring(0, 5);
  };

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    return status.replace("_", " ");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-700";

      case "ABSENT":
        return "bg-red-100 text-red-700";

      case "HALF_DAY":
        return "bg-yellow-100 text-yellow-700";

      case "LEAVE":
        return "bg-blue-100 text-blue-700";

      case "HOLIDAY":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (attendance.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 text-center shadow">
        <p className="text-gray-500">No attendance records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Employee
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Date
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Check In
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Check Out
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Working Hours
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Remarks
              </th>

              <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {attendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                {/* Employee */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {record.employeeName || "-"}
                  </div>

                  <div className="text-sm text-gray-500">
                    {record.employeeCode || "-"}
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                  {record.attendanceDate || "-"}
                </td>

                {/* Check In */}
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                  {formatTime(record.checkIn)}
                </td>

                {/* Check Out */}
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                  {formatTime(record.checkOut)}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      record.status,
                    )}`}
                  >
                    {formatStatus(record.status)}
                  </span>
                </td>

                {/* Working Hours */}
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                  {record.workingHours !== null &&
                  record.workingHours !== undefined
                    ? `${record.workingHours} hrs`
                    : "-"}
                </td>

                {/* Remarks */}
                <td className="max-w-xs px-6 py-4 text-sm text-gray-700">
                  <span className="block truncate">
                    {record.remarks || "-"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/attendance/edit/${record.id}`)}
                      className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceTable;
