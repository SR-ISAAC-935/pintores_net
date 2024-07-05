const express= require('express');
const {create} = require('express-handlebars');
require('dotenv').config()
require('./database/db')
const app= express();
const hbs=create({
    extname:'hbs',
    partialsDir:['Views/Components']
});

app.engine('hbs',hbs.engine);
app.set('view engine','hbs');
app.set('Views','./Views')
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/', require('./Routes/homeRoutes'))
app.use('/auth', require('./Routes/auth'))
    
app.use(express.static(__dirname + '/public'))
const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`escuchando en el puerto http://localhost:${PORT}`)
})
