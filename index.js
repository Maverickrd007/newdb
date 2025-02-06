const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose');
require('dotenv').config();
const app = express();


app.use(express.json());
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err=> console.log('Error connecting to database.',err));

const menuItemSchema=new mongoose.Schema({
  name:{type:String,required:true},
  descripton:{type:String},
  price:{type:Number,required:true},
})

const MenuItem=mongoose.model('MenuItem',menuItemSchema);

//PUT METHOD 
app.put('/menu/:id',(req,res)=>{
  const {id} =req.params;
  const updates=req.body;
  MenuItem.findByIdAndUpdate(id,updates,{new:true,runValidators:true})
  .then(updatedItem =>{
    if(!updatedItem){
      return res.status(404).json({error:'Menu item not found.'});
    }
    res.status(200).json({message:'Menu item updated successfully.',item:updatedItem});
  })
  .catch(err => res.status(500).json({error:'Failed to update the menu item.'})); 

});


//DELETE METHOD
app.delete('/menu/:id',(req,res)=>{
  const {id} =req.params;
  MenuItem.findByIdAndDelete(id)
  .then(deletedItem =>{
    if(!deletedItem){
      return res.status(404).json({error:'Menu item not found.'});
    }
    res.status(200).json({message:'Menu item deleted successfully'});
  })
  .catch(err=>res.status(500).json({error:'Failed to delete menu item.'}));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});