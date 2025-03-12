const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { upload } = require('../middleware/ticketMiddleware');

const ticketSchema = new mongoose.Schema({
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Customer', 
    required:[true,'Customer not added']
  },
  creationDate: {
    type: Date,
    immutable: true,
    default: ()=> Date.now()
  },
  imagePath:String,
  description:{
    type : String,
    required : [true,'Description not added']
  },
  technician: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Customer'
  },
  priority: {
    type:String,
    enum: ['Minor', 'Normal', 'Critical']
  },
  status: {
    type:String,
    enum: ['New', 'Approved', 'Rejected', 'Done']
  }
});

///////////////////////////////////////////////// Upload Images ////////////////////////////////////////////
ticketSchema.methods.uploadImage = function(req, res, next) {
  upload.single('image')(req, res, async function(err) {
    if (err) {
      res.send(err.message);
      next(err);
      console.log('................................');
    }
    try{
      this.imagePath = path.join(__dirname, '../Images', req.file.filename);
      await this.save();
      next();
    } catch(err){
      delete this.imagePath;
      next(err);
      console.log('....error....');
    }
  }.bind(this));
};

///////////////////////////////////////////////// Show Image /////////////////////////////////////////////
ticketSchema.methods.showImage = function(res) {
  const imageStream = fs.createReadStream(this.imagePath);
  imageStream.on('error', (err) => {
    console.error(err);
    res.status(500).send('Server error');
  });
  imageStream.pipe(res);
};

module.exports = mongoose.model("Ticket", ticketSchema);