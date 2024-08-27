const express= require('express')
const UrlValida= require('../middleware/UrlValida')
const router= express.Router();
const {agregarPost, leerPublicaciones, eliminarPost, editarPostForm, editarPosting, redirecting, leermispublicaciones} = require('../Controllers/homeControllers');
const urlValidator = require('../middleware/UrlValida');
const VerificarUser = require('../middleware/VerificarUser');
const { cerrarsesion } = require('../Controllers/authControllers');

router.get('/',VerificarUser,leerPublicaciones )
router.post('/',VerificarUser, UrlValida ,agregarPost)
router.get('/eliminar/:id',VerificarUser, eliminarPost)
router.get('/editar/:id', VerificarUser,editarPostForm)
router.post('/editar/:id',VerificarUser,urlValidator,editarPosting)
router.get('/:shortUrl',redirecting)
router.get('/profile',VerificarUser, leermispublicaciones)
module.exports=  router
