const xidJs = require('xid-js');
const User=require('../models/users')

const loginForm=(req,res)=>{
    res.render('login')
}

const registerUser = async (req,res) => {

    console.log(req.body)
const {userName, email, password}=req.body;
try {
    let user=await User.findOne({email});
    if(user)throw new Error("Usuario Existente 😒🤷‍♀️")
      user=  new User({userName,email,password, tokenConfirm:xidJs.next()})
     await user.save();
     res.redirect('/auth/login')
} catch (error) {
    res.json(error)
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
        res.redirect('/auth/login')
    } catch (error) {
        res.json({error:error.message})
    }
}

const registerForm=(req,res)=>{
    res.render('register')
}


module.exports={
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta
}