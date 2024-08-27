const xidJs = require('xid-js');
const User=require('../models/users')
const {validationResult}=require("express-validator")
const nodemailer = require("nodemailer");
const loginForm=(req,res)=>{
    res.render('login')
}

const registerUser = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        req.flash("mensajes",errors.array());
        return res.redirect("/auth/register")
    }
    //console.log(req.body)
const {userName, email, password}=req.body;
try {
    let user=await User.findOne({email});
    if(user)throw new Error("Usuario Existente 😒🤷‍♀️")
      user=  new User({userName,email,password, tokenConfirm:xidJs.next()})
     await user.save();
     const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "3e687299408992",
          pass: "38294023b25ff0"
        }
      });
       await transport.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Verifica tu correo", // plain text body
        html:`<a href="http://localhost:5001/auth/Confirmar/${user.tokenConfirm}">verifica tu correo aqui<a>`, // html body
      });
     req.flash("mensajes",[{msg:"revisa tu correo electronico"}])
     res.redirect('/auth/login')
} catch (error) {
    req.flash("mensajes",[{msg:error.message}]);
    return res.redirect("/auth/register")
}
} 

const confirmarCuenta= async (req,res)=>{
    const {token}=req.params;
    try {
        const user= await User.findOne({tokenConfirm : token})

        if(!user)
            throw new Error("Usuario no encontrado 😒🤷‍♀️")

        user.cuentaConfirmada= true;
        user.tokenConfirm=null
        await user.save();

        req.flash("mensajes",[{msg:"cuenta verificada adelante"}])
        res.redirect('/auth/login')
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect("/auth/login")
    }
}

const registerForm=(req,res)=>{
    res.render('register')
}

const loginUser= async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        req.flash("mensajes",errors.array());
        return res.redirect("/auth/login")
    }
    const {email, password}=req.body;
    try {
        const user= await User.findOne({email})
        if(!user) throw new Error ('no existe este email')
            if(!user.cuentaConfirmada) throw new Error("falta confirmar cuenta");
        if(!(await user.comparePassword(password))) throw new Error('contraseña incorrecta')

            req.login(user, function(err){
                if(err)
                    throw new Error("error al crear la sesion")

                console.log(user.userName);
                return res.redirect('/')
            })
    } catch (error) {
        console.log(error)
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect("/auth/login")
    }
}
const cerrarsesion=(req, res)=>{
    req.logout(function(err){
        if(err) throw new Error
        return res.redirect('/auth/login');
    })
   
}
module.exports={
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarsesion,
}