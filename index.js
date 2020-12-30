const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crea el servidor express
const app = express();

// Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json())

// Base de datos
dbConnection();

//console.log(process.env)

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));




app.listen( process.env.PORT, () => {
   console.log('Servidor corriendo en puerto: ' + process.env.PORT);
})