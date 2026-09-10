import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DepartmentTable from "../../components/department/DepartmentTable";
import { getAllDepartments } from "../../services/departmentService";

function DepartmentList() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDepartments = async () => {
    try {
      setLoading(true);

      const data = await getAllDepartments();

      setDepartments(data);
    } catch (error) {
      console.error("Error loading departments:", error);

      const message =
        error.response?.data?.message || "Failed to load departments.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleDepartmentDeleted = () => {
    loadDepartments();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Departments</h1>

        <button
          type="button"
          onClick={() => navigate("/departments/add")}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Department
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">Loading departments...</p>
          </div>
        </div>
      ) : (
        <DepartmentTable
          departments={departments}
          onDepartmentDeleted={handleDepartmentDeleted}
        />
      )}
    </DashboardLayout>
  );
}

export default DepartmentList;
