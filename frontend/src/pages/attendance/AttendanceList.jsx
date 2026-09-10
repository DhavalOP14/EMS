import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import { getAllAttendance } from "../../services/attendanceSevice";

function AttendanceList() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const data = await getAllAttendance();

      setAttendance(data);
    } catch (error) {
      console.error("Error loading attendance:", error);

      const message =
        error.response?.data?.message || "Failed to load attendance.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleAttendanceDeleted = () => {
    loadAttendance();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attendance</h1>

        <button
          type="button"
          onClick={() => navigate("/attendance/add")}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + Mark Attendance
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">Loading attendance...</p>
          </div>
        </div>
      ) : (
        <AttendanceTable
          attendance={attendance}
          onAttendanceDeleted={handleAttendanceDeleted}
        />
      )}
    </DashboardLayout>
  );
}

export default AttendanceList;
