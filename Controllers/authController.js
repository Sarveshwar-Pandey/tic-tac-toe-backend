
const bcrypt = require('bcrypt');
const UserModel = require('../Models/User')
const jwt = require('jsonwebtoken')

const signup = async (req, res) =>{
  try{
    const {name, email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
      res.status(409)
      .json({message: "User already exist!", success: false})
    }
    const userModel = new UserModel({name, email, password});
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201)
      .json({
        message: "Signup successfully",
        success: true
      })
  }catch(err){
    res.status(500)
      .json({
        message: "Internal server error",
        success: false
      })
  }
}

const login = async (req, res) =>{
  try{
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    const errorMessage = "Auth failed or password is wrong!";
    if(!user){
      res.status(403)
      .json({message: errorMessage, success: false})
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if(!isPassword){
      res.status(403)
      .json({message: errorMessage, success: false})
    }
    const jwtToken = jwt.sign(
      {email: user.email, _id: user.id},
      process.env.JWT_SECRET,
      {expiresIn: '24'}
    )
    res.status(200)
      .json({
        message: "Loggedin successfully",
        success: true,
        jwtToken,
        email,
        name: user.name
      })
  }catch(err){
    res.status(500)
      .json({
        message: "Internal server error",
        success: false
      })
  }
}

module.exports = {
  signup,
  login
}