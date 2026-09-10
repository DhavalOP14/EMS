import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllEmployees } from "../../services/employeeService";
import EmployeeTable from "../../components/employee/EmployeeTable";
import { Link } from "react-router-dom";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees();

      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>

        <Link
          to="/employees/add"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Add Employee
        </Link>
      </div>
      <EmployeeTable employees={employees} onEmployeeDeleted={loadEmployees} />
    </DashboardLayout>
  );
}

export default EmployeeList;
