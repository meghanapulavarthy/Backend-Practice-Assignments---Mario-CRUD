const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here
app.get('/mario',async(req,res)=> {
    res.send(await marioModel.find());
});

app.get('/mario/:id',async(req,res)=> {
    const id =res.params.id;
    try{
    res.send(await marioModel.findById(id));
    }
    catch(e){
        res.status(400).send({message:e.message});
    }
});

const isNullOrUnderfined =val => val === null || val === undefined;

app.post('/mario',async(req,res)=> {
    const newMario =req.body;
    if(isNullOrUnderfined(newMario.name) || isNullOrUnderfined(newMario.weight)){
        res.status(400).send({message:'either name or weight is missing'});
    }else{
        const newMarioDocument =new marioModel(newMario);
        await newMarioDocument.save();
        res.status(201).send(newMarioDocument);
    }
});


app.patch('/mario/:id',async(req,res)=> {
    const newMario =req.body;
    const id=req.params.id;
    try{
        const datapresent = await marioModel.findById(id);
        if(isNullOrUnderfined(newMario.name) && isNullOrUnderfined(newMario.weight)){
            res.status(400).send({message:'both name and weight is missing'});
        }else {
            if(!isNullOrUnderfined(newMario.name)){
                datapresent.name =newMario.name;
            }
            if(!isNullOrUnderfined(newMario.weight)){
                datapresent.weight =newMario.weight;
            }
            await datapresent.save();
            res.send(datapresent);
        }
    }catch(e){
        res.status(400).send({message : e.message});
    }


});

app.delete("/mario/:id", async(req,res)=> {
    const id =req.params.id;
    try{
        await marioModel.findById(id);
        await marioModel.deleteOne({_id:id});
        res.send({message: 'character deleted'});
    }catch(e){
        res.status(400).send({message:e.message});
    }
});



module.exports = app;