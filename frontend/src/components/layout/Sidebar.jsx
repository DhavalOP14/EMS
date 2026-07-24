import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuClass = ({ isActive }) =>
    `block rounded-md px-4 py-2 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-slate-800 text-white">
      <div className="border-b border-slate-700 p-6">
        <h2 className="text-2xl font-bold">EMS</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        <NavLink to="/dashboard" className={menuClass}>
          Dashboard
        </NavLink>

        <NavLink to="/employees" className={menuClass}>
          Employees
        </NavLink>

        <NavLink to="/departments" className={menuClass}>
          Departments
        </NavLink>

        <NavLink to="/attendance" className={menuClass}>
          Attendance
        </NavLink>

        <NavLink to="/leave-requests" className={menuClass}>
          Leave Requests
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
