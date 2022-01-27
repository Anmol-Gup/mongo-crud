const express= require('express');
const app=express();
const port=process.env.PORT || 3000
const path=require('path')
let flag=false;
let globalid=null;
//const uri = "mongodb://localhost:27017/crud";
const uri = 'mongodb+srv://surya:Aa12081999%40@cluster0.bkfjj.mongodb.net/crud?retryWrites=true&w=majority' || process.env.MONGO_DB_URI;

// mongoose-> establish a connection between mongoDB and nodejs
const mongoose=require('mongoose');

// create connection & return promise
mongoose.connect(uri, {useNewUrlParser: true})
.then(()=>{
    console.log("Connection Successful...")
}).catch((e)=>{
    console.log(e)
})

// create schema (structure of the document, default values, etc.)- defining fields & its data type.
const schema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
})

// create class Model or create collection
const Model= new mongoose.model("User",schema)  // collection name in singular form & schema 

// built-in middleware for serving static files
//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.use(express.json())

app.get('/',(req,res)=>{

    Model.find((err, docs) => {
        if (!err) {
            res.render("index", {
                data: docs
            });
        } else {
            res.send('Failed to retrieve the User List: ' + err);
        }
    });
})

app.get('/register',(req,res)=>{
    res.render('register',{
        data:"",
        error:""
    });
})

app.post('/register',(req,res)=>{
    const {name,email,gender}=req.body

    if(!name || !email || !gender)
    {
        res.render('register',{
          data:"",
          error:"Field Required!"  
        })
        return;
    }

    if(flag===false){
        insert(name,email,gender);
    }
    else{ 
        flag=false;
        update(globalid,name,email,gender);
    }
    res.redirect('/')
})

app.delete('/user-delete',(req,res)=>{

    deleteDocument(req.body.id);
    res.send("delete")
})

app.get("/register/:id",(req,res)=>{

    const id=req.params.id
    console.log(req.query.id)
    globalid=id;
    flag=true;

    try{

        const getdocument=async (id)=>{
            const result=await Model.findById({_id:id})
            res.render('register',{
                data:result,
                error:""
            })
        }
        getdocument(id);

    }catch(err)
    {
        console.log(err);
    }
})

// app.get("*",(req,res)=>{
//     res.render("error")    
// })

app.listen(port,()=>{
    console.log(`Server is running at ${port}...`)
})

const deleteDocument=async(id)=>{
    const result=await Model.deleteOne({id})
}

const update= async (_id,name,email,gender)=>{
    const result=await Model.updateOne({_id},{
        $set:{
            name,email,gender
        }
    })
}

const insert=async (name,email,gender)=>{
    try{
        const document= new Model({
            name, email, gender
        })

        const result= await document.save();
    }
    catch(err){
        console.error(err);
    }
}