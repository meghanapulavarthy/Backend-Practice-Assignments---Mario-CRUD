
const mongoose = require('mongoose');
const port = 3000
const app = require('./app');
const marioModel = require('./models/marioChar');
mongoose.connect('mongodb://localhost/testaroo', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

mongoose.connection.once('open', () =>{
    console.log('connection established')
}).on('connectionError',(err) =>{
    console.log(err);
})
app.get('mario', async(req,res) => {
    res.send(await marioModel.find());
});

app.get('/mario/:id',async(req,res) => {
    const id =req.params.id;
    try{
        res.send(await marioModel.findById(id));
    }
    catch(e){
        res.status(400).send({message:e.message});
    }
});

app.post("/mario",async(req,res)=> {
    const newMario =req.body;
    if(isNullOrUnderfined(newMario.name) || isNullOrUnderfined(newMario.weight)){
        res.status(400).send({message: "either name or weight is missing"});
    }else {
        const newMarioDocument = new marioModel(newMario);
        await newMarioDocument.save();
        res.status(201).send(newMarioDocument);
    }
});

app.patch("/mario/:id",async(req,res) => {
    const id= req.params.id;
    const newMario =req.body;
    try{
        const existingMarioDoc =await marioModel.findById(id);
        if(isNullOrUnderfined(newMario.name) && isNullOrUnderfined(newMario.weight)){
            res.status(400).send({message: "both name and weight is missing"});
        } else{
            if(!isNullOrUnderfined(newMario.name)){
                existingMarioDoc.name =newMario.name;
            }
            if(!isNullOrUnderfined(newMario.weight)){
                existingMarioDoc.weight =newMario.weight;
            }
            await existingMarioDoc.save();
            res.send(existingMarioDoc);
        }
    } catch(e){
        res.status(400).send({message: e.message});
    }

})

app.delete("/mario/:id", async(req,res)=> {
    const id=req.params.id;

    try{
        await marioModel.findById(id);
        await marioModel.deleteOne({_id:id});
        res.send({message:'character deleted'});
    }catch(e){
        res.status(400).send({message:e.message});
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`));