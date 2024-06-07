// backend/server.js

const express = require('express');
const path = require('path');
const apiController = require('./controller/apiController');
const app = express();
const PORT = 3000; // o el puerto que desees

app.use(express.json());

// Usar el controlador de la API para las rutas de la API
app.use('/api', apiController);

// Ruta para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../web')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
