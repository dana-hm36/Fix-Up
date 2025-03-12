const Ticket = require("../models/ticket");
const Customer = require('../models/customer');
const path = require("path");
const { get } = require("lodash");
const jwt  = require('jsonwebtoken')
///////////////////////////////////////////////// Create One Ticket (User) ////////////////////////////////
const createTicket_get = (req, res)=> {
    res.sendFile('C:/Users/zeina/Desktop/Junior/public/ticket.html');
};

let ticketID = "";
const createTicket_post= async (req, res)=> {
    console.log('././././');
    console.log(res.locals.user);
    const {description} = req.query;
    const status = "New";
    try{
        console.log('........');
        const ticket = await Ticket.create({ customer : res.locals.user, description, status });
        ticketID = ticket._id;
        // // console.log(ticket);
        const cust =  await Customer.findById(res.locals.user)
        cust.tickets.push(ticket)
        //console.log('before push');
        //console.log(cust);
        await cust.save()
        //console.log('after push');
        res.status(200).json({success : true,message :"add ticket success"})
    } catch(err){
        res.status(400).json({success : false ,message : res.send(err)});
    }
};

const getTicketByUser = async(req,res)=>{
    const id = req.params.id
    const tick = await Ticket.findOne({customer : id})
  try{
    let user = await Customer.findById({_id :tick.customer })
    user.tickets.push(tick)
    console.log(user);
    res.status(200).json({success: true,data : user});
  }
  catch(err){
    console.log(err);
    res.status(400).json({success : false , message : res.send(err)});
  }
}

const getTicUser = async(req,res)=>{
   try{
    const thisUser =  await Customer.findById(req.params.id).populate("tickets");

   res.status(200).json({success : true,data : thisUser});
   }catch(err){
    res.status(400).json({  success : false , message : res.send(err)});
   }
}


//one ticket with show two object customer&technician
const getUserTic = async(req,res)=>{
  const id = req.params.id;
  try{ 
    const oneTicket = await Ticket.findById(id).populate('customer').populate('technician');
    res.status(200).json({success : true, data : oneTicket});
  }catch(err){
    res.status(400).json({success : false , message : res.send(err)})
  }
}

///get ticket for admin
// 1- all ticket
// 2- ticket from user
const showAllTicket = async(req,res)=>{
  // let status = req.param('status')
  let status = req.query.status
  try{
  var query = await Ticket.find({'status' : status})
   res.status(200).json({success : true , data : query})
  }catch(err){
    res.status(400).json({success : false , message : res.send(err)})
  }
}
///get ticket for customer
const showMyTic = async(req,res)=>{
  try{
    const tickets = await Ticket.find({ customer: res.locals.user });
    res.status(200).json({success : true,data :tickets}) 
  }catch(err){
    res.status(200).json({success : true,message : res.send(err)})
  }
}

///get ticket for technician
const showMyTicTech = async(req,res)=>{
  console.log("...../.....");
  console.log(res.locals.user);
  try{
    const tickets = await Ticket.find({ customer: res.locals.user ,role : "technicial"});
    res.status(200).json({success : true,data :tickets}) 
  }catch(err){
    res.status(200).json({success : true,message : res.send(err)})
  }
}


const createTicket2_post = async (req, res)=> {
    try{
      const ticket = await Ticket.findById(ticketID);
      await ticket.uploadImage(req, res, () => {});
      res.send("done!");
    } catch(err){
        res.send(err.message);
    }
};

///////////////////////////////////////////////// Update One Ticket (Admin) //////////////////////////////
const updateTicket_patch = async (req, res)=> {
    const { technician, priority, status } = req.body;
    try{
        await Ticket.findByIdAndUpdate(req.params.ticketID,
           {$set: { technician, priority, status }});
           console.log(technician + "..............");
        res.send("Successfully updated the ticket!");
    } catch(err){
        res.send(err.message);
    }
};

///////////////////////////////////////////////// Get One Ticket /////////////////////////////////////////
 const get_ticket =  async (req, res)=> {
    try{
      const ticket = await Ticket.findById(req.params.ticketID);
      ticket.showImage(res);
      res.send(ticket);
    } catch(err) {
      res.send(err.message);
    }
};
const get_ticket_img =  async (req, res)=> {
    try{
      const ticket = await Ticket.findById(req.params.ticketID);
      ticket.showImage(res);
    } catch(err) {
      res.send(err.message);
    }
};

///////////////////////////////////////////////// Delete One Ticket //////////////////////////////////////
const delete_ticket =  async (req, res)=> {
    try{
      await Ticket.findByIdAndDelete(req.params.ticketID);
      res.send("Successfully deleted the ticket!");
    } catch(err) {
        res.send(err.message);
    }
};

///////////////////////////////////////////////// Get All Tickets ////////////////////////////////////////
const get_tickets =  async (req, res)=> {
    try{
      const tickets = await Ticket.find({});
      res.send(tickets);
    } catch(err){
      res.send(err.message);
    }
};

///////////////////////////////////////////////// Delete All Tickets ////////////////////////////////////
const delete_tickets =  async (req, res)=> {
    try{
      await Ticket.deleteMany();
      res.send("Successfully deleted all tickets!");
    } catch(err){
        res.send(err.message);
    }
};
///////////////////////////////////////
//create new ticket for a freelancer
const NewTick = async(res,req)=>{
  const id = req.params;
  const description = req.body;
  try{
    const ticket = Ticket.create(
    { customer : null,
      description,
      technician:id,
      priority :"Normal",
      status : "New" 
    }
    );
    res.status(201).json({ ticket: { _id: ticket._id, status: ticket.status } });
  }catch(err){
    res.status(500).json({ err });
  }
}

module.exports = {
    //createTicketUser,
    getTicketByUser,
    getTicUser,
   //createTicket2_post,
   createTicket_get,
   createTicket_post, 
   createTicket2_post,
   updateTicket_patch,
   get_ticket,
   get_ticket_img,
   delete_ticket,
   get_tickets,
   delete_tickets,
   getUserTic,
   showAllTicket,
   showMyTic,
   NewTick,
   showMyTicTech
   
}