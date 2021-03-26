const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const {dbPass} from './config.js';
console.log(dbPass);
const uri = "mongodb+srv://organicUser:xih2HrraMu3Pi.q@cluster0.kdxcg.mongodb.net/tasks?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


//--send html file
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})


//--for creating api
client.connect(err => {
  const todoCollection = client.db("tasks").collection("todos");

  //--create todo
  app.post("/addTodo",(req,res)=>{
      const todo=req.body;
      todoCollection.insertOne(todo)
      .then(result=>{
          res.redirect("/")
      })
  })

  //--get all todos
  app.get('/getAllTodos',(req,res)=>{
      todoCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })
  //--get single todo
  app.get('/getTodo/:id',(req,res)=>{
      todoCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err,documents)=>{
          res.send(documents[0])
      })
  })

  //-delete single todo
  app.delete('/delete/:id',(req,res)=>{
      const id=req.params.id;
      todoCollection.deleteOne({
          _id:ObjectId(id)
      }).then(result=>{
          res.send(result.deletedCount>0)
      })
  })

  //--patch/update single todo
  app.patch('/update/:id',(req,res)=>{
      todoCollection.updateOne({_id:ObjectId(req.params.id)},
      {
          $set:{title: req.body.title,description: req.body.description}
      })
      .then(result=>{
          res.send(result.modifiedCount>0)
      })
  })
  console.log("db connected");
});

app.listen(3000);