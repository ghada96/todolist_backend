var mongoose=require('mongoose')
var validator=require('validator')
const _=require('lodash')
const bcrypt=require('bcryptjs')

var UserSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email '
        }
    },
    password:{
        type:String,
        required:true,
     
        minlength:6
    }, //donne l'acces au utilisateur 
    tokens:[{
        //utilisateur nrml ou un admin
        access:{
            type:String,
            required:true
        },
        token:{
            type :String,
            required:true

        }
    }]

});

UserSchema.methods.toJSON=function(){
    var user=this;
    var userObject=user.toObject();

    return _.pick(userObject,['_id','firstname','lastname','email']);
}

//apres qu'il fait le sauvegarde dans la base de données il faut qu'il fait le cryptage
UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){// si le mot de passe est modifié 
        bcrypt.genSalt(10,(err,salt)=>{ // salt : type de cryptage
            bcrypt.hash(user.password,salt,(err,hash)=> {
                user.password=hash
                next()
            })
        })
    }else{
        next()
    }

})
// affecter le schema au model user
var User=mongoose.model('User',UserSchema) 

module.exports={User}