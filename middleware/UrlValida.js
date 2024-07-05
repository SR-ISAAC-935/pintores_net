const {URL}= require('url')

const urlValidator= (req,res,next)=>
{
    try {
        const {origin}=req.body;
        const urlFrontent= new URL(origin)
        if(urlFrontent.origin !== null)
            {
                return next()
            }
            else
            {
                throw new Error('url no valida 🤷‍♀️')
            }

    } catch (error) {
        res.redirect('/')
        console.log(error)
    }

}

module.exports=urlValidator