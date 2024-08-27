const Publics= require('../models/Postings')
const xid= require('xid-js')
const leerPublicaciones = async(req,res)=>
    {
        console.log(req.user)
        const urls = await Publics.find().lean();

       return  res.render('home',{urls:urls})
    }

    const leermispublicaciones= async(req,res)=>{
        try {
            console.log(req.user); // Asegúrate de que req.user esté definido
    
            // Encuentra las publicaciones del usuario
            const urls = await Publics.find({ user:req.user.id}).lean();
            
            console.log(res.json({urls:urls})); // Verifica lo que está retornando la consulta
            
            // Renderiza la vista con las URLs encontradas
           // res.render('profile', { urls: urls });
      } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
       return res.redirect('/');
      }
    }
const agregarPost= async(req,res)=>{

    const {origin}= req.body;
    try {
        const public=new Publics({origin:origin, shortUrl:xid.next(), user :req.user.id})
        console.log(public);
        await public.save();
        console.log('enviado')
        res.redirect('/')
    } catch (error) {
       req.flash("mensajes",[{msg:error.message}]);
       return res.redirect('/');
    }
}
const eliminarPost = async(req,res)=>{
    const { id }= req.params;
    try {
        console.log(id)
       const resp= await Publics.findByIdAndDelete(id);
       console.log(resp)
        res.redirect('/');
    } catch (error) {
        
       req.flash("mensajes",[{msg:error.message}]);
       return res.redirect('/');
    }
}
const editarPostForm = async(req,res)=>{
    try {
        const {id}= req.params
        const publics= await Publics.findById(id).lean();
        res.render('home',{publics})
    } catch (error) {
        
       req.flash("mensajes",[{msg:error.message}]);
       return res.redirect('/');
    }
}
const editarPosting= async(req,res)=>{
    try {
        const {id}= req.params
        const {origin}= req.body;
        await Publics.findByIdAndUpdate(id,{origin})
        res.redirect('/')
    } catch (error) {
        
       req.flash("mensajes",[{msg:error.message}]);
       return res.redirect('/');
    }
}
const redirecting= async (req,res)=>{
    const {shortUrl}= req.params;
    try {
        
        const url= await Publics.findOne({shortUrl})
        console.log(url.origin)
        res.redirect(url.origin)
    } catch (error) {
        
       req.flash("mensajes",[{msg:error.message}]);
       return res.redirect('/');
        
    }
}
module.exports={
    leerPublicaciones,
    agregarPost,
    eliminarPost,
    editarPostForm,
    editarPosting,
    redirecting,
    leermispublicaciones,
};