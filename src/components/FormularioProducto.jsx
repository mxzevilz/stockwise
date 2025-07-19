import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

function FormularioProducto() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !precio || !categoria || !stock) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await addDoc(collection(db, "productos"), {
        nombre,
        precio: parseFloat(precio),
        categoria,
        stock: parseInt(stock),
        fecha: serverTimestamp(), // 🕒 Aquí agregamos la fecha automáticamente
      });

      setNombre("");
      setPrecio("");
      setCategoria("");
      setStock("");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded mb-6">
      <h2 className="text-xl font-semibold mb-4">Agregar Producto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Agregar
      </button>
    </form>
  );
}

export default FormularioProducto;
