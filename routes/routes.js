const express =  require('express');
const route = express.Router();


const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const regionController = require('../controllers/regionController');
const techController = require('../controllers/technicianController');
const {verifyToken} = require('../middleware/authMiddleware');


route.get('/',(req,res)=>res.send('ok'));


//auth routes
route.post('/sign-up',authController.signUp);
route.post('/sign-up-with-email',authController.signUpWithEmail);
route.post('/verify-code',authController.verifyCode);
route.post('/login',authController.login);

//with token
route.get('/view-users',verifyToken,authController.viewUsers);
route.get('/view/:id',verifyToken,authController.viewOneUser);
route.delete('/delete/user/:id',verifyToken,authController.deleteUser);



//region Routes
route.post('/add-region',verifyToken,regionController.addRegion);
route.get('/get-all-region',verifyToken,regionController.allRegion);
route.get('/region/customer/:id',verifyToken,regionController.customerByRegion);
route.delete('/delete-region/:id',verifyToken,regionController.deleteRegion);
route.post('/add/sub/details',regionController.addDetails);
//technician Routes
route.post('/add-technician',verifyToken,techController.addTechnician);
route.get('/view-technician-by-name',verifyToken,techController.viewTechnicianByName);
route.get('/view-all-technician',verifyToken,techController.viewAllTechnician);
route.post('/edit-technician/:id',verifyToken,techController.updateTechnician);
route.delete('/delete-technician/:id', verifyToken,techController.deleteTechnician);
////tick

//route.post("/add/create/ticket/user",ticketController.createTicketUser);//create from user
route.get("/get/ticket/user/:id",ticketController.getTicketByUser);
route.get('/get/tic/:id',ticketController.getTicUser);//get user with array of tickets
//just Admin
route.get('/get/user/:id',verifyToken,ticketController.getUserTic);//one ticket with show two object customer&technician
route.get('/show/tic',verifyToken,ticketController.showAllTicket);//due to status//filter
//for customer Ticket or  
route.get('/show/ticket',verifyToken,ticketController.showMyTic);
route.get('/show/ticket/tech',verifyToken,ticketController.showMyTicTech);

//freelancer 
route.post('/ticket/:id/send',techController.NewRating);
route.post('/freelancer/:id/update',techController.updateRating);
route.get('/check/technicain',techController.checktech)
//test
route.get('/welcom',verifyToken,(req,res)=>{
    res.send("welcoooom");
});
route.post('/api/sign',authController.sign);
route.post('/api/get/bill',authController.verify);

module.exports = route;

