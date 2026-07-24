import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllEmployees } from "../../services/employeeService";
import EmployeeTable from "../../components/common/employee/EmployeeTable";

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
      </div>
      <EmployeeTable employees={employees} />
    </DashboardLayout>
  );
}

export default EmployeeList;
