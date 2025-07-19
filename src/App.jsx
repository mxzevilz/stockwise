import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Reportes from "./pages/Reportes";
import Sidebar from "./components/Sidebar";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  if (cargando) return <div className="p-6">Cargando...</div>;

  return (
    <Router>
      <div className="flex">
        {usuario && <Sidebar />}
        <div className="flex-1 p-4">
          <Routes>
            {usuario ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
