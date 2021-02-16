const mongoose = require('mongoose');

const RandomGenerateSchema =  mongoose.Schema({
    type : {
        type : String,
        required :false
    },  
    generateRandom : {
        type : String,
        required :false
    }
},{
     timestamps: true 
})

module.exports = mongoose.model('RandomGenerateSchema',RandomGenerateSchema)