import { toast } from "react-toastify";
import { deleteEmployee } from "../../services/employeeService";
import { useNavigate } from "react-router-dom";

function EmployeeTable({ employees, onEmployeeDeleted }) {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEmployee(id);

      toast.success("Employee deleted successfully.");

      // Reload employee list
      onEmployeeDeleted();
    } catch (error) {
      console.error("Error deleting employee:", error);

      const message =
        error.response?.data?.message || "Failed to delete employee.";

      toast.error(message);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">First Name</th>
            <th className="px-4 py-3 text-left">Last Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Department</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{employee.id}</td>

              <td className="px-4 py-3">{employee.firstName}</td>

              <td className="px-4 py-3">{employee.lastName}</td>

              <td className="px-4 py-3">{employee.email}</td>

              <td className="px-4 py-3">{employee.department?.name}</td>

              <td className="px-4 py-3">{employee.role?.name}</td>

              <td className="space-x-2 px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => handleEdit(employee.id)}
                  className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(employee.id)}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
