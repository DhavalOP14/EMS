import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AttendanceForm from "../../components/attendance/AttendanceForm";

import { getAttendanceById } from "../../services/attendanceSevice";

function EditAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const data = await getAttendanceById(id);

      setAttendance(data);
    } catch (error) {
      console.error("Error loading attendance:", error);

      const message =
        error.response?.data?.message || "Failed to load attendance.";

      toast.error(message);

      navigate("/attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">Loading attendance...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!attendance) {
    return null;
  }

  return (
    <DashboardLayout>
      <AttendanceForm attendance={attendance} isEdit={true} />
    </DashboardLayout>
  );
}

export default EditAttendance;
