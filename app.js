const express = require('express');
const app = express();
const db = require('./models');

const clienteRoutes = require('./routes/cliente.routes');
const pedidoRoutes = require('./routes/pedido.routes');

//Middlewares
app.use(express.json());

//Rutas
app.use('/api', clienteRoutes);
app.use('/api', pedidoRoutes);

// Conexión a PostgreSQL (sin .then() que inicie el servidor)
db.sequelize.authenticate() // Solo verifica la conexión
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => console.error('Error de conexión:', err));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

module.exports = app;