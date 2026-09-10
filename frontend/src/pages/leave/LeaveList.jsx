import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LeaveTable from "../../components/leave/LeaveTable";

import {
  getAllLeaveRequests,
  getMyLeaveRequests,
} from "../../services/leaveService";

function LeaveList() {
  const navigate = useNavigate();

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaveRequests = async () => {
    try {
      setLoading(true);

      let data;

      try {
        // ADMIN / HR
        data = await getAllLeaveRequests();
      } catch (error) {
        // EMPLOYEE / MANAGER
        if (error.response?.status === 403) {
          data = await getMyLeaveRequests();
        } else {
          throw error;
        }
      }

      setLeaveRequests(data);
    } catch (error) {
      console.error("Error loading leave requests:", error);

      const message =
        error.response?.data?.message || "Failed to load leave requests.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const handleLeaveUpdated = () => {
    loadLeaveRequests();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leave Requests</h1>

        <button
          type="button"
          onClick={() => navigate("/leave-requests/add")}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + Apply for Leave
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">Loading leave requests...</p>
          </div>
        </div>
      ) : (
        <LeaveTable
          leaveRequests={leaveRequests}
          onLeaveUpdated={handleLeaveUpdated}
        />
      )}
    </DashboardLayout>
  );
}

export default LeaveList;
