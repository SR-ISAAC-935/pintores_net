const express= require('express')
const UrlValida= require('../middleware/UrlValida')
const router= express.Router();
const {agregarPost, leerPublicaciones, eliminarPost, editarPostForm, editarPosting, redirecting} = require('../Controllers/homeControllers');
const urlValidator = require('../middleware/UrlValida');

router.get('/', leerPublicaciones )
router.post('/', UrlValida ,agregarPost)
router.get('/eliminar/:id', eliminarPost)
router.get('/editar/:id', editarPostForm)
router.post('/editar/:id',urlValidator,editarPosting)
router.get('/:shortUrl',redirecting)

module.exports=  router
