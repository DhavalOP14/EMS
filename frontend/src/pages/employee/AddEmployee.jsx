import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployeeForm from "../../components/employee/EmployeeForm";

function AddEmployee() {
  return (
    <DashboardLayout>
      <h1 className="mb-6 text-3xl font-bold">Add Employee</h1>

      <EmployeeForm />
    </DashboardLayout>
  );
}

export default AddEmployee;
