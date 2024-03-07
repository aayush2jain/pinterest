var express = require('express');
var router = express.Router();
const mongoose=require('mongoose')
const plm=require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/pin");

const userSchema = mongoose.Schema({
  username:String,
  email:String,
  password:String,
  number:Number,
  name:String,
  profileImage:String,
  boards:{
    type:Array,
    default:[]
  },
  posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"post"
  }]
});
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
userSchema.plugin(plm);
module.exports = mongoose.model("user",userSchema);
