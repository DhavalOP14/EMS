import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputField from "../common/InputField";
import {
  createDepartment,
  updateDepartment,
} from "../../services/departmentService";

function DepartmentForm({ department = null, isEdit = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /*
   * Fill the form when editing.
   */
  useEffect(() => {
    if (isEdit && department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
      });
    }
  }, [isEdit, department]);

  /*
   * Handle input changes.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  /*
   * Client-side validation.
   */
  const validateForm = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Department name is required.";
    } else if (formData.name.trim().length > 100) {
      validationErrors.name = "Department name cannot exceed 100 characters.";
    }

    if (formData.description.length > 255) {
      validationErrors.description =
        "Description cannot exceed 255 characters.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /*
   * Create or update department.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const departmentData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (isEdit) {
        await updateDepartment(department.id, departmentData);

        toast.success("Department updated successfully!");
      } else {
        await createDepartment(departmentData);

        toast.success("Department created successfully!");
      }

      navigate("/departments");
    } catch (error) {
      console.error(
        isEdit ? "Error updating department:" : "Error creating department:",
        error,
      );

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      const message =
        error.response?.data?.message ||
        (isEdit
          ? "Failed to update department."
          : "Failed to create department.");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/departments");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Department" : "Add Department"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update the department information below."
            : "Enter the department information below."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5">
          {/* Department Name */}
          <InputField
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter department name"
            error={errors.name}
            required
          />

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter department description"
              rows="4"
              className={`w-full rounded-lg border px-4 py-2 transition outline-none ${
                errors.description
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
              }`}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEdit
                ? "Update Department"
                : "Save Department"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentForm;
