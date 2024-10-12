const Publics = require('../models/Postings');
const multer = require("multer");
const xid = require('xid-js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const users = require('../models/users');
const leerPublicaciones = async (req, res) => {
    try {
        const urls = await Publics.find().lean(); // Cargar todas las publicaciones
        const user = await users.findById(req.user.id).lean(); // Cargar el usuario actual
        // Obtener mensajes de flash
        const successMessage = req.flash('success');
        const errorMessage = req.flash('error');
        console.log(user)
        return res.render('home', { 
            urls: urls, 
            user:user, 
            successMessage, 
            errorMessage 
        });
    } catch (error) {
        console.error('Error al leer publicaciones:', error);
        req.flash('error', 'Error al cargar las publicaciones');
        return res.redirect('/'); // Redirigir en caso de error
    }
};

const leermispublicaciones = async (req, res) => {
    try {
        const urls = await Publics.find({ user: req.user.id }).lean();
        const user = await users.findById(req.user.id).lean();
        
        const successMessage = req.flash('success');
        const errorMessage = req.flash('error');

        // Renderiza la vista 'profile'
        res.render('profile', { successMessage, errorMessage, urls: urls, user, imagen: user.foto });
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    }
};

const eliminarPost = async (req, res) => {
    const { id } = req.params;
    try {
        await Publics.findByIdAndDelete(id);
        req.flash('success', 'Publicación eliminada con éxito.');
        res.redirect('/');
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    }
};

const editarPostForm = async (req, res) => {
    try {
        const { id } = req.params;
        const publics = await Publics.findById(id).lean();
        
        const successMessage = req.flash('success');
        const errorMessage = req.flash('error');

        res.render('home', { publics, successMessage, errorMessage });
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    }
};

const editarPosting = async (req, res) => {
    try {
        const { id } = req.params;
        const { origin } = req.body;
        await Publics.findByIdAndUpdate(id, { origin });
        req.flash('success', 'Publicación actualizada con éxito.');
        res.redirect('/');
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    }
};

const cargarPerfil = async (req, res) => {
    try {
        const user = await users.findById(req.user.id);
        const urls = await Publics.find({ user: req.user.id }).lean();

        const successMessage = req.flash('success');
        const errorMessage = req.flash('error');

        res.render('profile', { user: req.user, imagen: user.foto, urls: urls, successMessage, errorMessage });
    } catch (error) {
        req.flash('error', 'Hubo un error al cargar el perfil.');
        return res.redirect('/');
    }
};

const PintoresPost = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                throw new Error("Error al procesar el formulario.");
            }

            const { Names } = fields;

            const fileKeys = Object.keys(files);
            if (!fileKeys.length) {
                throw new Error('Por favor agrega al menos una imagen.');
            }

            const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const processedImages = [];

            for (const key of fileKeys) {
                const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];

                for (const file of fileArray) {
                    if (!file.originalFilename) {
                        throw new Error('Uno de los archivos no tiene un nombre válido.');
                    }

                    if (!validMimeTypes.includes(file.mimetype.toLowerCase())) {
                        throw new Error(`El archivo ${file.originalFilename} no es un tipo de imagen válido (JPG, JPEG, PNG).`);
                    }

                    if (file.size > 5 * 1024 * 1024) { // 5MB
                        throw new Error(`El archivo ${file.originalFilename} es mayor a 5MB.`);
                    }

                    try {
                        const dirFile = path.join(__dirname, `/../public/Publicaciones/artesymas/${file.originalFilename}`);
                        const outputDir = path.dirname(dirFile);
                        await fs.promises.mkdir(outputDir, { recursive: true });

                        await sharp(file.filepath)
                            .resize(200, 200)
                            .jpeg({ quality: 80 })
                            .toFile(dirFile);

                        processedImages.push(file.originalFilename);
                    } catch (error) {
                        throw new Error(`Error al procesar la imagen ${file.originalFilename}: ${error.message}`);
                    }
                }
            }
            const user=await users.findById(req.user.id);
            const publics = new Publics({
                name: Names || "pablitos",
                Imagen: processedImages,
                user: req.user.id
            });

            await publics.save();
            req.flash('success', 'Publicación creada con éxito.');
            return res.redirect('/',{user:user});
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect("/");
        }
    });
};

const Perfil = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                throw new Error("Error al procesar el formulario.");
            }

            const fileArray = Array.isArray(files.myFile) ? files.myFile : [files.myFile];
            const file = fileArray[0];  // Asumimos que solo se sube un archivo para el perfil
            if (!file || !file.originalFilename) {
                throw new Error('Por favor selecciona una imagen válida.');
            }

            const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validMimeTypes.includes(file.mimetype.toLowerCase())) {
                throw new Error('Tipo de archivo no permitido. Solo JPG, JPEG y PNG.');
            }

            const extension = file.mimetype.split("/")[1];
            const dirFile = path.join(__dirname, `/../public/Perfiles/fotodinamica/${req.user.id}.${extension}`);
            const outputDir = path.dirname(dirFile);

            await fs.promises.mkdir(outputDir, { recursive: true });

            await sharp(file.filepath)
                .resize(200, 200)
                .jpeg({ quality: 80 })
                .toFile(dirFile);

            // Actualizar la foto en el perfil del usuario
            const user = await users.findById(req.user.id);
            user.foto = `${req.user.id}.${extension}`;
            await user.save();
            req.flash('success', "Foto de perfil actualizada correctamente");
            return res.redirect('/profile');
        } catch (error) {
            req.flash('error', error.message);
            return res.redirect('/profile');
        }
    });
};

module.exports = {
    leerPublicaciones,
    eliminarPost,
    editarPostForm,
    editarPosting,
    Perfil,
    leermispublicaciones,
    PintoresPost,
    cargarPerfil,
};
