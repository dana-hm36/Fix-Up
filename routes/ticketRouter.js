const express =  require('express');
const route = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyToken, checkUser } = require('../middleware/authMiddleware');


//route.get('*', requireAuth);

route.route("/ticket")
    .get(ticketController.createTicket_get)
    .post(verifyToken,ticketController.createTicket_post)
;
route.post("/ticket2", ticketController.createTicket2_post);

///////////////////////////////////////////////// All Tickets /////////////////////////////////////////////
///get ticket for admin
// 1- all ticket 
route.route("/tickets")
    .get(verifyToken,ticketController.get_tickets)//1
    .delete(verifyToken,ticketController.delete_tickets)
;

///////////////////////////////////////////////// Specific Tickets /////////////////////////////////////////
route.route("/tick/:ticketID")
    .get(verifyToken,ticketController.get_ticket)
    .patch(verifyToken,ticketController.updateTicket_patch)
    .delete(verifyToken,ticketController.delete_ticket)
;
route.get("/ticket/:ticketID/img", ticketController.get_ticket_img);

module.exports = route;