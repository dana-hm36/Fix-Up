const Region = require('../models/region');

const addRegion =  async(req,res)=>{
try{
const region = new Region(req.body);
await region.save();
res.status(200).json({success:true, message:'add Success' }); 
}catch(err){
    res.status(400).json({success: false, message:err.message});
}
}

const allRegion = async (req,res)=>{
    await Region.find()
    .then((result)=>{
        res.send(result);
       })
       .catch((err)=>{
         console.log(err);
       })
}

const customerByRegion = async (req,res)=>{
    const { id } = req.params;
    const customerByRegion = await Region.findById(id)
    .then((result)=>{
       res.send(result);
    })
    .catch((err)=>{
       res.send(err);
    })
 }
 
const deleteRegion = async(req,res)=>{
    const id = req.params.id;
    try{
        await Region.findByIdAndDelete(id);
        res.status(201).json({success : true, message : "delete success"});
    }catch(err){
        res.status(400).json({success : false , message : res.send(err)});
    }
}

const addDetails = async (req,res)=>{
    const { parentId } = req.body; 
    const det = await Region.u({parentId:parentId});
    console.log(det);
}


module.exports = {
    addRegion,
    allRegion,
    customerByRegion,
    deleteRegion,
    addDetails
}