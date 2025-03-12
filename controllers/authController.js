const Customer = require('../models/customer');
const HandleErrors = require('../routes/validations');
const jwt = require('jsonwebtoken');
const Region = require('../models/region');
const Ticket = require('../models/ticket');
const nodemailler = require('nodemailer');

const Mailgen = require('mailgen');
const { EMAIL,PASSWORD} = require('../routes/env');

const signUp = async (req,res,) =>{
    // const { email, password,phone,role, } = req.body  || req.params;      
    try {
      console.log(".........");
    //   await validator(req.body,ValidationRule,{},(err, status) => {
    //     if (!status) {
    //         res.status(412)
    //             .send({
    //                 success: false,
    //                 message: 'Validation failed',
    //                 data: err
    //             });
    //     } else {
    //         next();
    //     }
    // }).catch( err => console.log(err));
      // const customer = await Customer.create({ email, password,phone,role });
      const user = new Customer(req.body);
      await user.save();
      console.log(user+'----------');
      const region = Region.findById({_id:user.region});
     
      // region.cust.push(user);
      // await region.save();
      console.log(region+'////////////');
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({
        success : true,
        message : " add sucess",
        user : user,
        token : token
      });
    }catch(err){
        const errors = HandleErrors.handleErrors(err);
        console.log(errors);
        res.status(400).json({ errors });
        
      }
      
}





const login = async (req,res)=>{
  const {phone ,password} = req.query;
   console.log('login');
  try{
    const user = await Customer.log(phone,password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({success:true,message:"login Success",token:token,data:user})
  }catch(err){
    const errors = HandleErrors.handleErrors(err); 
    res.status(400).json({success : false , message : res.send(errors)});
  }
}


const viewUsers = async ( req,res)=>{

    await Customer.find().populate()
    .then((result)=>{
      res.status(200).json({success : true, data : result });
     })
     .catch((err)=>{
      res.status(401).json({success : false, message : res.send(err) });
    
    })
}


const viewOneUser = async (req,res)=>{
  const id = req.params.id;
  console.log(id);
  await Customer.findById(id)
  .then((result)=>{
    res.status(200).json({success : true, data : result });
  })
  .catch((err)=>{
    res.status(401).json({success : false, message : res.send(err) });
  })
}


const deleteUser = async (req,res)=>{
  const id = req.params.id;
  Customer.findByIdAndDelete(id)
  .then((result)=>{
      if(result){
        res.send({
          "message" : "delete success"
        });
      }
  })
  .catch((err)=>{
    res.status(401).json({success : false , message : res.send(err)});
    console.log(err);
  })

}



//  const allCustomer = async(req,res)=>{
//   await Customer.find({role : "Customer"}).populate('tickets')
//   .then((result)=>{
//     result.forEach((e)=>{
//       res.send(e.tickets.forEach((t)=>
//       res.send(t) //just property ticket 
//       ));
//     });
//   })
//   .catch((err)=>{
//     res.send(err);
//   })
// }


//create token


// const allCustomer = async(req,res)=>{
//   await Customer.find({role : "Customer"}).populate('tickets')
//   .then((result)=>{
//     result.forEach((e)=>{
//       res.send(e)///just this object when relation another object
//     });
//   })
//   .catch((err)=>{
//     res.send(err);
//   })
// }

const allCustomer = async(req,res)=>{
  await Customer.find({role : "Customer"}).populate('tickets')
  .then((result)=>{
      res.send(result) ///list of object Role customer 
  })
  .catch((err)=>{
    res.send(err);
  })
}




const maxAge = 3 * 24 * 60 * 60; 
const createToken = (id)=>{
  return jwt.sign({ id},'maintance tiketing System',{
    expiresIn : maxAge
  });
};


const sign = async(req,res)=>{
  //testing account
  let testAccount = await nodemailler.createTestAccount();

  let transporter = nodemailler.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

    // send mail with defined transport object
    let message ={
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Successfully Register with us ", // plain text body
      html: "<b>Successfully Register with us</b>", // html body
    }
    
    transporter.sendMail(message).then((info)=>{
      res.status(201).json({
        message : "you should recive an email",
        info : info.messageId,
        preview : nodemailler.getTestMessageUrl(info)
    })
    }).catch(err => {
      res.status(400).json({message : res.send(err)})
    })
}
// //send mail from real gmail account
// const getbill = async(req,res)=>{
//   const userEmail = req.query;
//    let config = {
//     service : 'gmail',
//     auth : {
//       user : 'EMAIL',
//       pass : 'PASSWORD'
//     }
//    }

//    let transporter = nodemailler.createTransport(config);

//    let MailGenerator = new Mailgen({
//     theme : "default",
//     product : {
//       name : "Mailgen",
//       link : 'http://mailgen.js/'
//     }
//    })
  
// let response = {
//         body: {
//             name : "Daily Tuition",
//             intro: "Your bill has arrived!",
//             table : {
//                 data : [
//                     {
//                         item : "Nodemailer Stack Book",
//                         description: "A Backend application",
//                         price : "$10.99",
//                     }
//                 ]
//             },
//             outro: "Looking forward to do more business"
//         }
//     }

//     let mail = MailGenerator.generate(response)

//     let message = {
//         from : EMAIL,
//         to : userEmail,
//         subject: "Place Order",
//         html: mail
//     }
  

//     transporter.sendMail(message).then(() => {
//       return res.status(201).json({
//           msg: "you should receive an email"
//       })
//   }).catch(error => {
//       return res.status(500).json({ error })
//   })

// }
let transporter = nodemailler.createTransport({
  service:'gmail',
  host:'smpt.gmail.com',
  secure:false,
  auth:{
    user: EMAIL,
    pass:PASSWORD
  }
})

const verifyUserEmail = async(req,res)=>{
  const userEmail = req.query;
  try{
    let info = await transporter.sendMail({
      from: EMAIL, // sender address
      to: userEmail, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    console.log(info.messageId);
    console.log("testing");
  }catch(err){
    res.send(err);
    console.log(err);
  }
}


const verify = async(req,res)=>{
  const userEmail = req.body.email;
  const transporter = nodemailler.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  });
  console.log(EMAIL);
  const mailOptions = {
    from: EMAIL,
    to: userEmail,
    subject: 'Maintenance Ticketing System',
    text: `Dear ${userEmail},

    Thank you for submitting a maintenance ticket. We have received your request and our team is working to resolve the issue as soon as possible.
    
        We appreciate your patience and will keep you updated on the progress of your request.
    
    `
  };
  
  // Send the email using the transporter and the mail options
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      res.send(info.response);
      console.log('Email sent: ' + info.response);
    }
  });
}


const signUpWithEmail = async (req,res,) =>{     
  const { email, password,phone,role, region,name} = req.body  || req.params;     
try {
  const user = new Customer({ email, password,phone,role,region,name });
  const verificationCode = Math.floor(Math.random() * 1000000);
  user.verificationCode = verificationCode;
  await user.save();
 const transporter = nodemailler.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

const mailOptions = {
  from: EMAIL,
  to: email,
  subject: 'Verification Code',
  text: `Your verification code is: ${verificationCode}`
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

    res.status(200).json({
      success: true,
      message: 'Please check your email for a verification code.',
      verificationCode: verificationCode
    });
      } catch (err) {
      const errors = HandleErrors.handleErrors(err);
      console.log(errors);
      res.status(400).json({success : false , message : res.send(errors) });
      } 
}

const verifyCode = async(req,res)=>{
  const email = req.body.email;
  const code = req.body.code;
  console.log(email);
  console.log(code);

  try{
    const user = await Customer.findOne({email});
    console.log(user.email);
    console.log(user.verificationCode);
      

    if(user.verificationCode == code){
      console.log(true);
        user.verified = true;
        await user.save();
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({
        success : true,
        message : " add sucess",
        user : user,
        token : token
      });

    }


  }catch(err){
      const errors = HandleErrors.handleErrors(err);
        console.log(errors);
        res.status(400).json({ errors });
  }


}

module.exports = {
    signUp,
    login,
    viewUsers,
    viewOneUser,
    deleteUser,
    allCustomer,
    signUpWithEmail,
    sign,
    verifyUserEmail,
    verify,
    verifyCode
}