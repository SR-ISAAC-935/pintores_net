const Publics= require('../models/Postings')
const xid= require('xid-js')
const leerPublicaciones = async(req,res)=>
    {
        const urls = await Publics.find().lean();

        res.render('home',{urls:urls})
    }
const agregarPost= async(req,res)=>{

    const {origin}= req.body;
    try {
        const public=new Publics({origin:origin, shortUrl:xid.next()})
        console.log(public);
        await public.save();
        console.log('enviado')
        res.redirect('/')
    } catch (error) {
        console.log(error)
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
        console.log(error  )
    }
}
const editarPostForm = async(req,res)=>{
    try {
        const {id}= req.params
        const publics= await Publics.findById(id).lean();
        res.render('home',{publics})
    } catch (error) {
        console.log(error)
    }
}
const editarPosting= async(req,res)=>{
    try {
        const {id}= req.params
        const {origin}= req.body;
        await Publics.findByIdAndUpdate(id,{origin})
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}
const redirecting= async (req,res)=>{
    const {shortUrl}= req.params;
    try {
        
        const url= await Publics.findOne({shortUrl})
        console.log(url.origin)
        res.redirect(url.origin)
    } catch (error) {
        
    }
}
module.exports={
    leerPublicaciones,
    agregarPost,
    eliminarPost,
    editarPostForm,
    editarPosting,
    redirecting
};