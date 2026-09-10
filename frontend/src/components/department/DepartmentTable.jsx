import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { deleteDepartment } from "../../services/departmentService";

function DepartmentTable({ departments, onDepartmentDeleted }) {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/departments/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDepartment(id);

      toast.success("Department deleted successfully.");

      onDepartmentDeleted();
    } catch (error) {
      console.error("Error deleting department:", error);

      const message =
        error.response?.data?.message || "Failed to delete department.";

      toast.error(message);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((department) => (
            <tr key={department.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{department.id}</td>

              <td className="px-4 py-3 font-medium">{department.name}</td>

              <td className="px-4 py-3">{department.description || "-"}</td>

              <td className="px-4 py-3">
                {department.active ? "Active" : "Inactive"}
              </td>

              <td className="space-x-2 px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => handleEdit(department.id)}
                  className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(department.id)}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {departments.length === 0 && (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                No departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DepartmentTable;
