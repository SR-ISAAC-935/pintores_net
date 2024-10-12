const Publics = require('../models/Postings');
const users = require('../models/users');
const mongoose = require('mongoose');
const cargaBusqueda = async (req, res) => {
    try {
        const usuarios = await users.find().lean(); // Obtenemos todos los usuarios
        console.log(usuarios);
        // Mostramos cada nombre de usuario en la consola
        usuarios.forEach(usuario => {
            console.log(usuario.userName);
        });

        // Enviamos el array completo de usuarios a la vista
        res.render('sugerido', { 
            mensajes: req.flash("mensajes"), 
            usuarios: usuarios 
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        req.flash('mensajes', [{ msg: 'Error al cargar los usuarios' }]);
        res.redirect('/'); // Redirigir a otra página o mostrar un error
    }
};


const cargarperfilajeno = async (req, res) => {
    try {
        const userId = req.params.id;  // Obtener el id desde los parámetros de la URL
        console.log('User ID recibido:', userId); // Debugging para ver qué ID se recibe

        // Validar si el userId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            req.flash('mensajes', [{ msg: 'ID de usuario no válido' }]);
            return res.redirect('/');  // Redirigir a otra página o mostrar un error
        }

        // Buscar el usuario en la base de datos
        const usuario = await users.findById(userId).lean();
        if (!usuario) {
            req.flash('mensajes', [{ msg: 'Usuario no encontrado' }]);
            return res.redirect('/');
        }

        // Buscar las URLs asociadas
        const urls = await Publics.find({ user: userId }).lean();

        // Renderizar la vista del perfil del usuario encontrado
        res.render('perfilEncontrado', { 
            usuario: usuario, 
            urls: urls, 
            imagen: usuario.foto,
            mensajes: req.flash("mensajes") // Agregar mensajes a la vista
        });
    } catch (error) {
        console.error('Error al cargar el perfil del usuario:', error);
        req.flash('mensajes', [{ msg: 'Error al cargar el perfil del usuario' }]);
        res.redirect('/');
    }
};

const obtenerSugerencias = async (req, res) => {
    const query = req.query.q;

    try {
        // Buscar usuarios que coincidan con el nombre
        const buscados = await users.find({ userName: { $regex: query, $options: 'i' } })
            .limit(5)
            .lean();

        // Enviar la lista de usuarios encontrados a la vista
        res.render('sugerido', {
            usuarios: buscados, // Enviar todo el array de usuarios
            mensajes: req.flash('mensajes')
        });
    } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



module.exports = {
    cargaBusqueda,
    cargarperfilajeno,
    obtenerSugerencias,
};
