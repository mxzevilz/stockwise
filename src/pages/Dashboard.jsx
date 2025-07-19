// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [porCategoria, setPorCategoria] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "productos"));
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(docs);

        const conteo = {};
        docs.forEach(p => {
          conteo[p.categoria] = (conteo[p.categoria] || 0) + 1;
        });
        const datosAgrupados = Object.entries(conteo).map(([cat, count]) => ({
          categoria: cat,
          cantidad: count,
        }));
        setPorCategoria(datosAgrupados);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const totalProductos = productos.length;
  const totalStock = productos.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Panel de Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold">🛒 Total de Productos</h2>
          <p className="text-3xl">{totalProductos}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold">📦 Stock Total</h2>
          <p className="text-3xl">{totalStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Productos por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porCategoria}>
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Distribución por Categoría</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={porCategoria}
                dataKey="cantidad"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {porCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
