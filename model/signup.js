const mongoose = require('mongoose');
const Schema = mongoose.Schema 

const user = new Schema({
    name:{
        type : String,
        required :true
    },
    username:{
        type : String,
        required :true
    },
    email:{
        type:String,
        required :true
    },
    password:{
        type:String,
        required :true
    },
    friends: [{
        username: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },

      }],
    status: String,
    blockedUsers:{
      type : Array
    }
    
})

const  SignupData = mongoose.model('user',user);
module.exports = SignupData;