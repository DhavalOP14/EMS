function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">
        Employee Management System
      </h1>

      <button className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
        Logout
      </button>
    </header>
  );
}

export default Header;
