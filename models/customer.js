const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const Roles = require('../models/enums/myEnum');

const customerSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Name not added'],
    minlength:[3, 'Minimum name length is 3 characters']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  phone :{
    type:String,
    required:[true,'Phone number not added'],
    unique:true,
    minlength:[10,'Minimum phone number length is 10 characters'],
    maxlength:[10,'Maximum phone number length is 10 characters'],
    validate: {
      validator: v=> {
        return /^09[3-9][0-9]+$/.test(v);
      },
      message: 'Invalid phone number.'
    }
  },
  role :{
    type:String,
    default : "Customer",
    // required:[true,'please enter a role  '],
  },
    region:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      required:[true,'Region not added']
    },
  tickets:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Ticket'
  }] ,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  verificationCode :{
    type : Number
  },
  verified : {
    type : Boolean,
    default : false
  },
  street :{
    type : String,
    //required : [true,'Street not added']
  },
  building :{
    type : String,
    //required : [true,'Building not added']
  },
  floor :{
    type : String,
    //required : [true,'Floor not added']
  },
  flat :{
    type : String,
    //required : [true,'Flat not added']
  },
  email : {
    type :String,
    required : [true,'email is nod added'],
  }
},{
  timestamps: true
});


customerSchema.pre('save',async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
});



// static method 
customerSchema.statics.log = async function(phone,password){
  const user = await Customer.findOne({phone})
  if(user){
    const customer = await bcrypt.compare(password,user.password);
    if(customer){
      return user;
    } 
    throw Error('incorrect password');
  }
  throw Error('incorrect phone'); 
}



const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

