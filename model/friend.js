// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const friend = new Schema({
//     username:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'SignupData'
//       }
// })

// const friendData = mongoose.model('friend',friend);
// module.exports = friendData;
const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const chatSchema = new mongoose.Schema({

    senderid:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'user'
    },
    receiverid:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'user'
    },
    
        message:{
            type :String,
            required :true
        },
        createdAt: {
            type: Date,
            default: Date.now
          }
    

})

const chatData = mongoose.model('chatdata',chatSchema);
module.exports = chatData;