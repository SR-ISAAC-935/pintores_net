const mongoose= require('mongoose')

const uri= process.env.URI_MONGO
main().catch(err=> console.log(err))

async function main()
{
    await mongoose.connect(uri)
    console.log('conectado ✔')
}

