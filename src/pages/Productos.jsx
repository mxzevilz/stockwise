// src/pages/Productos.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import * as XLSX from "xlsx";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idProducto, setIdProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    });
    return () => unsubscribe();
  }, []);

  const agregarProducto = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !categoria || !stock) return alert("Completa todos los campos");
    await addDoc(collection(db, "productos"), {
      nombre,
      precio: parseFloat(precio),
      categoria,
      stock: parseInt(stock),
    });
    setNombre(""); setPrecio(""); setCategoria(""); setStock("");
  };

  const eliminarProducto = async (id) => {
    await deleteDoc(doc(db, "productos", id));
  };

  const iniciarEdicion = (prod) => {
    setModoEdicion(true);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setCategoria(prod.categoria);
    setStock(prod.stock);
    setIdProducto(prod.id);
  };

  const editarProducto = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "productos", idProducto), {
      nombre,
      precio: parseFloat(precio),
      categoria,
      stock: parseInt(stock),
    });
    setModoEdicion(false);
    setNombre(""); setPrecio(""); setCategoria(""); setStock("");
    setIdProducto(null);
  };

  const productosFiltrados = productos.filter(prod => {
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? prod.categoria === filtroCategoria : true;
    return coincideBusqueda && coincideCategoria;
  });

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productosFiltrados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, "productos.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      <form onSubmit={modoEdicion ? editarProducto : agregarProducto} className="grid grid-cols-2 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {modoEdicion ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="flex items-center gap-4 mb-4">
        <input
          className="border p-2 rounded w-1/2"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {[...new Set(productos.map(p => p.categoria))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Exportar Excel
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left p-2 border-r">Nombre</th>
            <th className="text-left p-2 border-r">Precio</th>
            <th className="text-left p-2 border-r">Categoría</th>
            <th className="text-left p-2 border-r">Stock</th>
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((prod) => (
            <tr key={prod.id} className="border-b hover:bg-gray-50">
              <td className="p-2 border-r">{prod.nombre}</td>
              <td className="p-2 border-r">S/ {parseFloat(prod.precio).toFixed(2)}</td>
              <td className="p-2 border-r">{prod.categoria}</td>
              <td className="p-2 border-r">{prod.stock}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => iniciarEdicion(prod)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >Editar</button>
                <button
                  onClick={() => eliminarProducto(prod.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;
