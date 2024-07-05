const mongoose= require('mongoose')
const {Schema}= mongoose;

const publicSchema=Schema({
    
        origin: {
            type:String,
            unique:true,
            required:true
        },       // Source of the content (e.g., website URL)
        shortUrl:{
            type:String,
            unique:true,
            required:true,
            default:""
        },    // Shortened URL of the content
        comments: [           // Array of comments (optional)
          {
            id:Number,
            content: "string",  // Text of the comment
            author: "string",   // Name or identifier of the commenter (optional)
            timestamp: "string"  // Time comment was posted (optional)
          }
        ]
    
})
const Publics=mongoose.model('publicSchema',publicSchema)

module.exports=Publics;