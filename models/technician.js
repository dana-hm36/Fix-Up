const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,'Name']
    },
    region:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region', 
        required:[true,'Region not added']
    },

});

module.exports = mongoose.model("Technician", technicianSchema);
