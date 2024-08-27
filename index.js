const express= require('express');
const {create} = require('express-handlebars');
const session= require('express-session')
const flash=require('connect-flash');
const passport = require('passport');
const User=require('./models/users')
const csrf= require('csurf')
require('dotenv').config()
require('./database/db')

const app= express();

app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized:false,
    name:"secret-name-yolo",
}));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done)=>done(null,{id:user._id,userName:user.userName}))

passport.deserializeUser( async (user,done)=>{
    
    const userdb=await User.findById(user.id)
    return done(null,{id:userdb._id, username: userdb.userName});
})

/*
app.get('/mensaje-flash',(req, res)=>
{
    res.json(req.flash('mensaje'))
})
app.get('/crear-mensaje',(req,res)=>
{
    req.flash('mensaje','mensaje flash creado')
    res.redirect('/mensaje-flash')
})
app.get('/ruta-protegida', (req,res)=>{
    res.json(req.session.usuario ||'sin sesion usuario')
})
app.get('/crear-session',(req, res)=>{
    req.session.usuario='yolo';
    res.redirect('/ruta-protegida')
})*/
const hbs=create({
    extname:'hbs',
    partialsDir:['Views/Components']
});

app.engine('hbs',hbs.engine);
app.set('view engine','hbs');
app.set('Views','./Views')
app.use(express.urlencoded({extended:false}))
app.use(csrf())

app.use((req,res, next)=>{
    res.locals.csrfToken=req.csrfToken();
    console.log(req.csrfToken());
    res.locals.mensajes= req.flash("mensajes");
    next();
})

app.use(express.json())
app.use('/', require('./Routes/homeRoutes'))
app.use('/auth', require('./Routes/auth'))
    
app.use(express.static(__dirname + '/public'))
const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`escuchando en el puerto http://localhost:${PORT}`)
})
