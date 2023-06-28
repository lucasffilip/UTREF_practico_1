// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas, encontrarPorId } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
   res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para encontrar una fruta por ID
app.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const frutaPorID = BD.find((fruta) => fruta.id === id);
    if (!frutaPorID) res.status(404).send("No se encuentra la fruta");
    res.send(frutaPorID);
});

// Ruta para modificar una fruta por ID
app.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const indice = BD.findIndex((fruta) => fruta.id === id);
    const modificacion = req.body;
    BD[indice] = modificacion;
    guardarFrutas(BD);
    if (indice < 0) res.status(404).send("No se encuentra la fruta");
    res.send(BD[indice]);
});

// Ruta para eliminar una fruta por ID
app.delete("/:id", (req, res) => { 
    const id = parseInt(req.params.id);
    const indice = BD.findIndex((fruta) => fruta.id === id);
    BD.splice(indice, 1);
    if (indice < 0) res.status(404).send("No se encuentra la fruta");
    res.send("Fruta eliminada");
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
