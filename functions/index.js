const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.holaMundo = functions.https.onRequest((req, res) => {
  res.send("¡Hola mundo desde Firebase!");
});

exports.agregarProducto = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Método no permitido");
  }

  const { nombre, precio, categoria, stock } = req.body;

  try {
    const nuevoProducto = { nombre, precio, categoria, stock };
    const docRef = await db.collection("productos").add(nuevoProducto);
    res.status(200).send(`Producto agregado con ID: ${docRef.id}`);
  } catch (error) {
    res.status(500).send(`Error al agregar producto: ${error.message}`);
  }
});
