const check = require('express-validator');
const { isRegExp } = require('lodash');
const Customer = require('../models/customer');



exports.verifyPasswordsMatch = (req, res, next) => {
    const {confirmPassword} = req.body
    
    return check('password_confirmation')
      .withMessage('password must be matches')
      .equals(confirmPassword)
}


const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { password: '',role :'',phone:'',street :'',building:'',floor:'',flat:''};
console.log('---------------------------------');  
  //phone Validate
//   if((/^09[3-9][0-9]+$/).test()){
//     // console.log(req.body.phone);
//     errors.phone = ['phone is valid'];
// }

  // duplicate email error
  // if (err.code === 11000) {
  //   errors.email = 'that email is already registered';
  //   return errors;
  // }
   //duplicate phone error
  if (err.code === 11000) {
    errors.phone = 'that phone is already registered';
    return errors;
  }
  // check('password_confirmation','password does not matche').equals(body.password)

   //validate for log
   if(err.message === 'incorrect password'){
    errors.password = 'incorrect password';
    return errors;
  }
  // if(err.message === 'incorrect email'){
  //   errors.email = 'incorrect email';
  //   return errors;
  // }
    
      // if(err.message === 'Invalid phone number'){
      //   errors.phone = 'Invalid phone number'
      //   console.log("--------------------");
      //   return errors;
      // }
  // validation errors
  if (err.message.includes('Customer validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(properties.path, (/^09[3-9]{2}[0-9]{6}$/.test(properties.value)))
      //if(properties.path === 'phone' && !(/^09[3-9]{2}[0-9]{6}$/.test(properties.value))){
        if(properties.path === 'phone' && (/^09[3-9][0-9]+$/.test(properties.value))){
       return errors[properties.path] = "phone invalid";
              
      }
      // if(properties.path === 'phone' && !/^09[3-9][0-9]$/.test(properties.value)) { 
      //   throw Error('incorrect phone');
      // }
      console.log('-=-=-=-=-=-=');
      errors[properties.path] = properties.message;
    });
  } 

  return errors;
}
// const Validator = require('validatorjs');
// // const phoneReg = /^09[3-9][0-9]+$/;
// Validator.register(('strict',value => phoneReg.test(value),'phone is valid'));

module.exports = {
  handleErrors,
}

