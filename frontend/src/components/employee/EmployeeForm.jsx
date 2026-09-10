import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

import { createEmployee, updateEmployee } from "../../services/employeeService";

import { getAllDepartments } from "../../services/departmentService";
import { getAllRoles } from "../../services/roleService";

function EmployeeForm({ employee = null, isEdit = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    roleId: "",
    departmentId: "",
    managerId: "",
    designation: "",
    salary: "",
    joiningDate: "",
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  /*
   * Load departments and roles.
   */
  const loadDropdownData = async () => {
    try {
      setLoadingData(true);

      const [departmentData, roleData] = await Promise.all([
        getAllDepartments(),
        getAllRoles(),
      ]);

      setDepartments(departmentData);
      setRoles(roleData);
    } catch (error) {
      console.error("Error loading employee form data:", error);

      toast.error("Failed to load departments or roles.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDropdownData();
  }, []);

  /*
   * Populate form when editing an existing employee.
   */
  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        password: "",
        phone: employee.phone || "",
        roleId: employee.role?.id?.toString() || "",
        departmentId: employee.department?.id?.toString() || "",
        managerId: employee.manager?.id?.toString() || "",
        designation: employee.designation || "",
        salary: employee.salary?.toString() || "",
        joiningDate: employee.joiningDate || "",
      });
    }
  }, [isEdit, employee]);

  /*
   * Handles input/select changes.
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

    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      validationErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Enter a valid email address.";
    }

    /*
     * Password is required only when creating.
     */
    if (!isEdit) {
      if (!formData.password) {
        validationErrors.password = "Password is required.";
      } else if (formData.password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters.";
      }
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone number is required.";
    }

    if (!formData.roleId) {
      validationErrors.roleId = "Please select a role.";
    }

    if (!formData.departmentId) {
      validationErrors.departmentId = "Please select a department.";
    }

    if (!formData.designation.trim()) {
      validationErrors.designation = "Designation is required.";
    }

    if (!formData.salary) {
      validationErrors.salary = "Salary is required.";
    } else if (Number(formData.salary) <= 0) {
      validationErrors.salary = "Salary must be greater than zero.";
    }

    if (!formData.joiningDate) {
      validationErrors.joiningDate = "Joining date is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /*
   * Create or update employee.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);

      const employeeData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),

        roleId: Number(formData.roleId),
        departmentId: Number(formData.departmentId),

        managerId: formData.managerId ? Number(formData.managerId) : null,

        designation: formData.designation.trim(),
        salary: Number(formData.salary),
        joiningDate: formData.joiningDate,
      };

      /*
       * Password is needed when creating.
       *
       * For editing, we only send password if
       * the user entered a new password.
       */
      if (!isEdit) {
        employeeData.password = formData.password;
      }

      if (isEdit) {
        await updateEmployee(employee.id, employeeData);

        toast.success("Employee updated successfully!");
      } else {
        await createEmployee(employeeData);

        toast.success("Employee created successfully!");
      }

      navigate("/employees");
    } catch (error) {
      console.error(
        isEdit ? "Error updating employee:" : "Error creating employee:",
        error,
      );

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      const message =
        error.response?.data?.message ||
        (isEdit ? "Failed to update employee." : "Failed to create employee.");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  if (loadingData) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500">Loading employee form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update the employee information below."
            : "Enter the employee information below."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            error={errors.firstName}
            required
          />

          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            error={errors.lastName}
            required
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            error={errors.email}
            required
          />

          {!isEdit && (
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              error={errors.password}
              required
            />
          )}

          <InputField
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            error={errors.phone}
            required
          />

          <InputField
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="e.g. Software Developer"
            error={errors.designation}
            required
          />

          <InputField
            label="Salary"
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Enter salary"
            error={errors.salary}
            required
          />

          <InputField
            label="Joining Date"
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            error={errors.joiningDate}
            required
          />

          <SelectField
            label="Department"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            options={departments}
            error={errors.departmentId}
            required
          />

          <SelectField
            label="Role"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            options={roles}
            error={errors.roleId}
            required
          />

          <InputField
            label="Manager ID"
            type="number"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            placeholder="Enter manager ID (optional)"
            error={errors.managerId}
          />
        </div>

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
                ? "Update Employee"
                : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
