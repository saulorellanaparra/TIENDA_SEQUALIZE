const { Pedido } = require('../models');
exports.obtenerPedidos = async (req, res) => {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
};

exports.crearPedido = async (req, res) => {
    try {
        const { fecha, total, clienteId } = req.body;
          // Validación más robusta
        if (!fecha || !total || !clienteId) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios: fecha, total, clienteId"
            });
        }

        if (isNaN(total)) {
            return res.status(400).json({
                error: "El total debe ser un número válido"
            });
        }

        //Crear nuevo Pedido
        const nuevoPedido = {
            fecha: req.body.fecha,
            total: req.body.total,
            clienteId: req.body.clienteId,
        }

        // Agregar a nuestro a la base de datos"
        const agregarPedido = await Pedido.create({
            fecha: nuevoPedido.fecha,
            total: parseFloat(nuevoPedido.total),
            clienteId: nuevoPedido.clienteId,
        });

        res.status(200).json({
            message: 'Pedido agregado correctamente',
            data: nuevoPedido,
        });

    } catch (error) {
        console.error("Error detallado:", error);  // Log para diagnóstico

        // Manejo específico de errores de Sequelize
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: "Error de referencia: El cliente no existe"
            });
        }

        res.status(500).json({
            error: 'Error al crear el pedido',
            detalle: error.message  // Enviar mensaje de error al cliente (opcional)
        });
    }
};

//Buscar Pedido segun Id
exports.buscarPedidoId = async (req, res) => {
    try {
        // Recuperamos el id
        const pedido = await Pedido.findByPk(req.params.id);
        if(!pedido){
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        res.json(pedido);

    } catch (error) {
        return res.status(500).json({
            error: "Error al obtener el Pedido",
        })
    }
}


//Eliminar Pedido
exports.eliminarPedido = async (req, res) => {
    try {
        // Recuperamos el id
        const pedidoId = await Pedido.findByPk(req.params.id);
        if(!pedidoId){
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        //Eliminar cliente
        await pedidoId.destroy();

        res.status(200).json({
            message:'Pedido eliminado correctamente',
        });

    } catch (error) {

        if(error.name === 'SequelizeForeignKeyConstraintError'){
            return res.status(400).json({
                error:'No se puede eliminar, tiene registros asociados'
            })
        }

        return res.status(500).json({ error: "Error al obtener el pedido"})
    }
}

//Actualizar Pedido
exports.actualizarPedido = async (req, res) => {
    try {
        // Recuperamos el id
        const { id } = req.params;
        const {fecha, total, createdAt, updatedAt, clienteId} = req.body;

        // Validación básica
    if (!fecha || !total || !clienteId) {
        return res.status(400).json({ error: "Fecha,  total y id cliente son obligatorios" });
    }

      // Verificar si el pedido existe
    const pedidoExistente = await Pedido.findByPk(id);
    if (!pedidoExistente) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }

      // Actualizar registro
    const [updates] = await Pedido.update(
        {
            fecha,
            total,
            createdAt,
            updatedAt,
            clienteId,
        },
        { where: { id } }
    );

      // Obtener pedido actualizado
    const pedidoActualizado = await Pedido.findByPk(id);

    res.status(200).json({
        message: 'Pedido actualizado correctamente',
        pedido: pedidoActualizado
    });

    } catch (error) {

        return res.status(500).json({
            error: "Error al obtener el pedido",
        })
    }
}