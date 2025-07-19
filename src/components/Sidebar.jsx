import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">📦 Stockwise</h2>
      <nav className="flex-1 flex flex-col gap-4">
        <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded">
          📊 Dashboard
        </Link>
        <Link to="/productos" className="hover:bg-gray-700 px-3 py-2 rounded">
          📦 Productos
        </Link>
        <Link to="/reportes" className="hover:bg-gray-700 px-3 py-2 rounded">
          📁 Reportes
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mt-auto"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;
