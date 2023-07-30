const express = require('express');
const SignupData = require('../model/signup')
var router = express.Router();
const bcrypt = require('bcryptjs');


router.post('/signup',async(req,res)=>{
    console.log("data reached backend")
    try {
        let { confirmpassword, ...user } = req.body;
        let checkuser = user.username;
        let existingname = await SignupData.findOne({ username: checkuser});
        let existinguser = await SignupData.findOne({email:user.email})
        router.post('/signup',async(req,res)=>{
    console.log("data reached backend")
    try {
        let { confirmpassword, ...user } = req.body;
        let checkuser = user.username;
        let existingname = await SignupData.findOne({ username: checkuser});
        let existinguser = await SignupData.findOne({email:user.email})
        if(existinguser){
            res.json({message:"user already exists"})
        }
        if(existingname){
            res.json({message:"username already exists"})
        }
        else{
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newuser = new SignupData({
            name:user. name,
            username: user.username,
            email: user.email,
            password: hashedPassword
          });
        await newuser.save();
        console.log('new user added')
        res.json({newuser,message:"success"}).status(200)
        }
     
    } 
    catch (error) {
        console.log('signup failed');
    }
})
        if(existinguser){
            res.json({message:"user already exists"})
        }
        if(existingname){
            res.json({message:"username already exists"})
        }
        else{
            console.log("entered else")
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newuser = new SignupData({
            name:user. name,
            username: user.username,
            email: user.email,
            password: hashedPassword
          });
        await newuser.save();
        console.log('new user added')
        res.json({newuser,message:"success"}).status(200)
        }
     
    } 
    catch (error) {
        console.log('signup failed');
    }
})

//existing username
router.get('/username/:value', async(req,res)=>{
    try {
        const name = req.params.value;
        console.log(name);
        let existinguser = await SignupData.findOne({ username:name});
        if(existinguser){
            res.json({message:"username taken"})
        }

    } catch (error) {
        console.log(error)
        res.json({message:error}).status(400)
    }

})

var jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
        console.log(email)
      let loginuser = await SignupData.findOne({ email: email });  
      if (loginuser) {
        const passwordMatches = await bcrypt.compare(password, loginuser.password);
        if (passwordMatches) {
          console.log("password matches");
          var userdata = {
            username : loginuser.username,
            userid :loginuser._id
          }
          let payload = {email:email,password:password};
          let token = jwt.sign(payload,'ilikeapples')
          console.log(token);
          res.json({ message: "login success", data:userdata,status: 200 ,token:token});
        } else {
          console.log("password does not match");
          res.json({ message: "password does not match", status: 500 });
        }
      } else {
        console.log("user does not exist");
        res.json({ message: "user does not exist", status: 404 });
      }
    } catch (error) {
      console.log("error occurred");
      res.json({ message: "error", status: 400 });
    }
  });
  

  // to display profileuser details 
  router.get('/uniquelogin/:userid',async(req,res)=>{
      console.log("data reached unique user backend")
    try {
      let id = req.params.userid
    let userlogin = await SignupData.findById(id)
    if (!userlogin) {
      return res.status(404).json({ message: 'User not found' });
    }
    // console.log(userlogin)

    res.json({data:userlogin});
    } catch (error) {
      res.json({message:error}).status(400)

    }
  })
  router.get('/chatroom/:userid/:fid',async(req,res)=>{

    console.log('reached friend details backend')
    try {
      let userid = req.params.userid; 
      let fid = req.params.fid
      console.log(fid);
      let profileuser = await SignupData.findById(userid);
      // console.log(profileuser)
      const chatfriend = profileuser.friends.find(friend => friend._id.toString() === fid);
      console.log(chatfriend.username)
      let friendetails = await SignupData.findOne({username:chatfriend.username})
      res.json({data:friendetails});
    } catch (error) {
      res.json({message:error}).status(400)

    }
  })

  router.get('/active/:username',async(req,res)=>{
    console.log('reached online status backend')

    try {
       let friend = req.params.username;
       console.log(friend);
       let name = friend.username
       findinuser = await SignupData.findOne({username:friend});
       console.log(findinuser)
       let activestatus =  findinuser.status
       res.json({data:activestatus});
    } catch (error) {
      console.log(error);
    }
  })




  //logout
  router.get('/logout/:userid',async(req,res)=>{
    console.log('reached logout backend')

    try {
       let userid = req.params.userid;
       updatedstatus = await SignupData.updateOne({ _id : userid },{ $set: { status: "offline" } })
       updateduser = await SignupData.findOne({ _id : userid })
       res.json({data:updateduser.status});


    } catch (error) {
      console.log(error);

    }
  })

router.post('/block',async (req,res)=>{
  try {
    let profileuser = req.body.data.sender;
    let blockuser = req.body.data.recipient
    senderblocked = await SignupData.updateOne({username:profileuser},{$addToSet:{blockedUsers:blockuser}});
    // block = await SignupData.find({$or: [
    //   { username: profileuser },
    //   { username: blockuser }
    // ]}) 
    if(senderblocked.acknowledged == true   ){
        // res.json({senderdata:block[0], receiverdata:block[1],"status":"success"})
        res.json({"status":"success"})

    }else{
        res.json({"status":"failed"})
    }
  } catch (error) {
    console.log(error);
  }
})
router.post('/unblock',async (req,res)=>{
  try {
    let profileuser = req.body.data.sender;
    let blockuser = req.body.data.recipient
    senderblocked = await SignupData.updateOne({username:profileuser},{$pull:{blockedUsers:blockuser}});

    if(senderblocked.acknowledged == true   ){
        res.json({"status":"success"})

    }else{
        res.json({"status":"failed"})
    }
  } catch (error) {
    console.log(error);
  }
})

module.exports = router