const express= require('express');
const { loginForm, registerForm, registerUser,confirmarCuenta } = require('../Controllers/authControllers');
const router= express.Router();

router.get('/login',loginForm)
router.post('/register',registerUser)
router.get('/register',registerForm)
router.get('/Confirmar/:token',confirmarCuenta)

module.exports= router