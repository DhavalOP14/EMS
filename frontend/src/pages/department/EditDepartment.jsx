import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DepartmentForm from "../../components/department/DepartmentForm";

import { getDepartmentById } from "../../services/departmentService";

function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        const data = await getDepartmentById(id);

        setDepartment(data);
      } catch (error) {
        console.error("Error loading department:", error);

        const message =
          error.response?.data?.message || "Failed to load department.";

        toast.error(message);

        navigate("/departments");
      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [id, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">Loading department...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!department) {
    return null;
  }

  return (
    <DashboardLayout>
      <DepartmentForm department={department} isEdit={true} />
    </DashboardLayout>
  );
}

export default EditDepartment;
