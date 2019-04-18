var mongoose=require('mongoose')
//creation de model Todo avec les caracteristiques text, completed ...
var Todo=mongoose.model('Todo',
{
    text:{
        type:String,
        required: true,
        minLength:1,
        trim: true
    },// if done is completed 
    completed: {
        type: Boolean,
        default:false
    }, 
    completedAt:{
        type:Number,
        default:null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});
module.exports={Todo};