const express = require('express');
const router = express.Router();
const { obtenerPedidos, crearPedido, buscarPedidoId, eliminarPedido, actualizarPedido
} = require('../controllers/pedido.controller');

router.get('/pedidos', obtenerPedidos);

router.post('/pedidos', crearPedido);

router.get('/pedidos/:id', buscarPedidoId);

router.delete('/pedidos/:id', eliminarPedido);

router.put('/pedidos/:id', actualizarPedido);

module.exports = router;

