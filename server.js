const express=require('express');
const bodyparser=require('body-parser')
const cors=require('cors')


var routes=express();
const port=3000;

routes.use(cors())
routes.use(bodyparser.json())
// les services sont de type json
//routes.use(express.static(__dirname))

const user=require('./controllers/userController')
const todo=require('./controllers/todoController')


routes.use('/todo',todo)
routes.use('/user',user)


routes.get('/',(req,res)=>{
    res.send('hello from the server ')
});

routes.listen(port,()=>{
    console.log("server started on port",port)
})//creation de server et lui donne le port 3000
