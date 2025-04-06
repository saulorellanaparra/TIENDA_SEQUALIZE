const { Cliente } = require('../models');

exports.obtenerClientes = async (req, res) => {
    const clientes = await Cliente.findAll();
    res.json(clientes);
};

//Agregar Cliente
exports.crearCliente = async (req, res) => {

    try {
        let cliente = req.body;
        if(!req.body.nombre || !req.body.correo)
            return res.status(400).json({
                error:"Nombre y correo son necesarios"
            });

        //Crear nuevo Cliente
        const nuevoCliente = {
            nombre: req.body.nombre,
            correo: req.body.correo,
        }

        // Agregar a nuestro a la base de datos"
        const agregarCliente = await Cliente.create({
            nombre: nuevoCliente.nombre,
            correo: nuevoCliente.correo
        });

        res.status(201).json({
            message: 'Cliente agregado correctamente',
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Error al crear el usuario',
        })
    }

};

//Buscar Cliente segun Id
exports.buscarClienteId = async (req, res) => {
    try {
        // Recuperamos el id
        const cliente = await Cliente.findByPk(req.params.id);
        if(!cliente){
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json(cliente);

    } catch (error) {
        return res.status(500).json({
            error: "Error al obtener el cliente",
        })
    }
}


//Eliminar Cliente
exports.eliminarCliente = async (req, res) => {
    try {
        // Recuperamos el id
        const clienteId = await Cliente.findByPk(req.params.id);
        if(!clienteId){
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        //Eliminar cliente
        await clienteId.destroy();

        res.status(200).json({
            message:'Cliente eliminado correctamente',
        });

    } catch (error) {

        if(error.name === 'SequelizeForeignKeyConstraintError'){
            return res.status(400).json({
                error:'No se puede eliminar, tiene registros asociados'
            })
        }

        return res.status(500).json({ error: "Error al obtener el cliente"})
    }
}


//Actualizar Cliente
exports.actualizarCliente = async (req, res) => {
    try {
        // Recuperamos el id
        const { id } = req.params;
        const {nombre, correo, createdAt, updatedAt} = req.body;

        // Validación básica
    if (!nombre || !correo) {
        return res.status(400).json({ error: "Nombre y correo son obligatorios" });
    }

      // Verificar si el cliente existe
    const clienteExistente = await Cliente.findByPk(id);
    if (!clienteExistente) {
        return res.status(404).json({ error: "Cliente no encontrado" });
    }

      // Verificar correo único (excepto para el mismo cliente)
    if (correo !== clienteExistente.correo) {
        const correoExistente = await Cliente.findOne({ where: { correo } });
        if (correoExistente) {
            return res.status(409).json({ error: "El email ya está registrado" });
        }
    }

      // Actualizar registro
    const [updates] = await Cliente.update(
        {
            nombre,
            correo,
            createdAt,
            updatedAt
        },
        { where: { id } }
    );

      // Obtener cliente actualizado
    const clienteActualizado = await Cliente.findByPk(id);

    res.status(200).json({
        message: 'Cliente actualizado correctamente',
        cliente: clienteActualizado
    });

    } catch (error) {

        // Manejo específico de errores de Sequelize
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: "El correo ya existe" });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }

        return res.status(500).json({
            error: "Error al obtener el cliente",
        })
    }
}
