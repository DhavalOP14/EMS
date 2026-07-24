import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await login(formData);

      localStorage.setItem("token", response.token);

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Employee Management System
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
