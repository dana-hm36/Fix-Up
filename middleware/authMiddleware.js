const jwt = require('jsonwebtoken');
const User = require('../models/customer')
// const session = require('express-session');

const verifyToken = (req, res, next) =>
 { 
    if (!req.headers.authorization) {
    return res.status(401).json({ error: "Not Authorized" });
  }

  // Bearer 
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  // console.log(token);
  try {
    // Verify the token is valid
     jwt.verify(token, "maintance tiketing System",async (err, decodedToken) => {
///from auth i can access to id i can named created by 
        if (err) {
            console.log(err.message);
                console.log("....." + res.locals.user);
                res.locals.user = null;
                res.send(err.message);
                next();
        } else {
                console.log("loggggggggggggg");
                let user = await User.findById(decodedToken.id);
                // console.log(user);
                res.locals.user = user;
                console.log(user);
                next();

              }
      });
    // const decodedToken = jwt.decode(token)
    // const customerId = decodedToken.id
    // console.log('customer Id ', customerId);
  } catch (error) {
    return res.status(401).json({ error: "Not Authorized" });
  }
  };
 
const checkUser = (req, res, next)=> {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,"maintance tiketing System" , async (err, decodedToken)=> {
            if(err){
                res.locals.user = null;
                res.send(err.message);
                next();
            } else{
                let user = await User.findById(decodedToken.id);
                console.log(user);
                res.locals.user = user;
                next();
            }
        });
    } else{
        res.locals.user = null;
        next();
    }
}

  module.exports = {
    verifyToken,
    checkUser,

  };