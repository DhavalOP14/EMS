import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployeeForm from "../../components/employee/EmployeeForm";
import { getEmployeeById } from "../../services/employeeService";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getEmployeeById(id);

        setEmployee(data);
      } catch (error) {
        console.error("Failed to load employee:", error);

        const message =
          error.response?.data?.message || "Failed to load employee.";

        toast.error(message);

        navigate("/employees");
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500">Loading employee...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <DashboardLayout>
      <EmployeeForm employee={employee} isEdit={true} />
    </DashboardLayout>
  );
}

export default EditEmployee;
