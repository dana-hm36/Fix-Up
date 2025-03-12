const Customer = require('../models/customer');
const Handle = require('../routes/validations');
const Ticket = require('../models/ticket');
const addTechnician = async(req,res)=>{
  try{
    const tech = new Customer(req.body);
    console.log(req.body);
    console.log(tech);
    await tech.save();
    console.log(req.body);  
    res.status(201).json({success : true, message : 'add technician success'});
    
  }catch(err){ 
    const errors = Handle.handleErrors(err)
    res.status(400).json({success : false ,message : res.send(errors)});
  }
}

const viewTechnicianByName = async(req,res)=>{
  try{
   const viewTech = await Customer.findOne({role :"technicial"});
    res.status(201).json({success:true,data:viewTech});
  }catch(err){
    res.status(400).json({success:false, message:res.send(err)});
  }
}

const viewAllTechnician = async(req,res)=>{
  try{  const viewTech = await Customer.find({role :"technicial"});
  res.status(201).json({success:true,data:viewTech});
}
  catch(err){
  res.status(400).json({success:false, message:res.send(err)});
}
 
}

const updateTechnician = async(req,res)=>{
  const id = req.params.id;
  console.log(id);
   try{
   const edit = await Customer.findByIdAndUpdate(id,{name : req.body.name,phone:req.body.phone},{new : true});
   await edit.save();
    res.status(201).json({success:true,message:'edit success'});
   }catch(err){
    res.status(400).json({success:false, message:res.send(err)});
   }
}

const deleteTechnician = async (req,res)=>{
  const id = req.params.id;
  try{
    await Customer.findByIdAndDelete(id);
    res.status(201).json({success : true, message : "delete Success"});
  }catch(err){
    res.status(400).json({success : false , message : res.send(err)});
  }
} 
/////////// freelancer///////////////
//check if the technician is busy or not 
const checktech = async(req,res)=>{
  try{
    const availableFre = await Customer.find({role: "technician",tickets : {$size : 0} });
    res.status(200).json({success : true ,availableFre});
  }catch(err){
    res.status(400).json({success : false , message : res.send(err)});
  }
  
}




// const NewRating = async(req,res)=>{
//   // const freelancerId = req.params.id;
//   // console.log(freelancerId);
//   const {ticketId,rating,comment} = req.query;
//   console.log(ticketId,rating,comment);
//   try{ 
//     //  const freelancer = await Customer.findById(freelancerId);
//      const freelancer = 
//      await Customer.findByIdAndUpdate(
//       req.params.id , {$set :{ticketId,rating,comment}}
//      );
//      await freelancer.save();
//      console.log(freelancer);
//     //  const newRating = {
//     //   ticket : ticketId,
//     //   rating,
//     //   comment
//     //  };
//     //  freelancer.ratings.push(newRating);
//     //  console.log(newRating);
//     //  await freelancer.updateOne({ratings : freelancer.rating});
//     //  console.log({ratings : freelancer.rating});
//   res.status(201).json({success:true,message : "success"});
// }
//   catch(err){
//   res.status(400).json({success:false, message:res.send(err)});
// }
// }
const NewRating = async (req, res) => {
  // Get the ticket id from the route path
  const  id  = req.params.id;
  console.log(id);
  try {
    const ticket = await Ticket.findById(id);
    //check if freelancer is busy or not 
    const freelancers = await Customer.find({ role: 'Freelancer', tickets: { $size: 0 } });
    if (freelancers.length === 0) {
      return res.status(400).json({ message: 'No freelancers available' });
    }
    
    freelancers.sort((a, b) => b.rating - a.rating);
    //return array
    const freelancer = freelancers[0];
    //take the above
    //update the ticket 
    await Ticket.findByIdAndUpdate(id, { technician: freelancer._id, status: 'Approved' });

    // push ticket id in tickets for freelancer
    await Customer.findByIdAndUpdate(freelancer._id, { $push: { tickets: id } });

    return res.status(200).json({success : true ,message: 'the ticket send to freelancer' });
  } catch (error) {
    return res.status(400).json({ success : false , message : res.send(error) });
  }
};
//update rating freelancer
const updateRating =  async (req, res) => {
  const id  = req.params.id;
  const { rating } = req.body;

  try {
    const freelancer = await Customer.findByIdAndUpdate(id, { rating });

    return res.status(200).json({ success: true , message : "update succes the rating"});
  } catch (error) {
    return res.status(400).json({ sucess : false , message : res.send(error) });
  }
};

module.exports = {
  addTechnician,
  viewTechnicianByName,
  viewAllTechnician,
  updateTechnician,
  deleteTechnician,
  NewRating,
  updateRating,
  checktech 
}