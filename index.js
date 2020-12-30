const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crea el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

console.log(process.env)

// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true, 
        msg: 'Hola Express'
    })
})

app.listen( process.env.PORT, () => {
   console.log('Servidor corriendo en puerto: ' + 3000);
})