import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import * as XLSX from "xlsx";

function Reportes() {
  const reporteRef = useRef();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
      const categoriasUnicas = [...new Set(data.map((p) => p.categoria))];
      setCategorias(categoriasUnicas);
    });
    return () => unsubscribe();
  }, []);

  const exportarPDF = () => {
    html2canvas(reporteRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("reporte_productos.pdf");
    });
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productosFiltrados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, "reporte_productos.xlsx");
  };

  const productosFiltrados = productos.filter((prod) => {
    const nombreCoincide = prod.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const categoriaCoincide = categoriaSeleccionada === "" || prod.categoria === categoriaSeleccionada;
    return nombreCoincide && categoriaCoincide;
  });

  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosAMostrar = productosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cambiarPagina = (numero) => setPaginaActual(numero);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📊 Panel de Reportes</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
        />
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={exportarPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Exportar PDF
        </button>
        <button
          onClick={exportarExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Exportar Excel
        </button>
      </div>

      <div ref={reporteRef} className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Stock</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {productosAMostrar.map((prod) => (
              <tr key={prod.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{prod.nombre}</td>
                <td className="px-6 py-4">S/ {parseFloat(prod.precio).toFixed(2)}</td>
                <td className="px-6 py-4">{prod.categoria}</td>
                <td className="px-6 py-4">{prod.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => cambiarPagina(i + 1)}
              className={`px-4 py-2 rounded-lg border ${
                paginaActual === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reportes;
