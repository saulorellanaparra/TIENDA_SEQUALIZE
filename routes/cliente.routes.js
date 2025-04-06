const express = require('express');
const    router = express.Router();
const { obtenerClientes, crearCliente, buscarClienteId, eliminarCliente, actualizarCliente } = require('../controllers/cliente.controller');

router.get('/clientes', obtenerClientes)

router.post('/clientes', crearCliente);

router.get('/clientes/:id', buscarClienteId);

router.delete('/clientes/:id', eliminarCliente);

router.put('/clientes/:id', actualizarCliente);

module.exports = router;