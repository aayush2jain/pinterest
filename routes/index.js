var express = require('express');
var router = express.Router();
const userModel=require('./users');
const postModel=require("./post");
const passport = require('passport');
const localStragety=require('passport-local');
const upload=require("./multer");
/* GET home page. */
passport.use(new localStragety(userModel.authenticate()));
router.get('/', function(req, res, next) {
  res.render('index',{nav: false});
});
router.get('/register',function(req,res){
  res.render('register');
})
router.get('/add',isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({username: req.session.passport.user})
  res.render('add',{nav:true});
})
router.get('/profile',isLoggedIn,async function(req,res){
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
  res.render("profile",{user});
})
router.get('/show/posts',isLoggedIn,async function(req,res){
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
  res.render("show",{user});
})
router.get('/card/:postId',isLoggedIn,async function(req,res){
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
  const postId = req.params.postId;
  const post = user.posts.find(post => post._id.toString() == postId);
  console.log(postId);
  console.log(post);

    // console.log(specificPost);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.render("card", {user,post});
})
router.get('/feed',isLoggedIn,async function(req,res){
  const user = await userModel.findOne({username: req.session.passport.user})
  const posts=await postModel.find().populate("username")
  res.render("feed",{user,posts});
})
router.post('/createpost',isLoggedIn,upload.single("postimage"),async function(req,res,next){
  const user= await userModel.findOne({username: req.session.passport.user})
const post = await postModel.create({
  user: user._id,
  title: req.body.title,
  discription: req.body.discription,
  postimage: req.file.filename
});
user.posts.push(post._id)
await user.save();
res.redirect("/profile");
})
router.post('/fileupload',upload.single("image"),async function(req,res){
  const user= await userModel.findOne({username: req.session.passport.user})
  user.profileImage =req.file.filename;
 await user.save();
 res.redirect("/profile");
})
router.post("/register",function(req,res,next){
  const data=new userModel({
    username:req.body.username,
    email:req.body.email,
    number:req.body.number,
    name:req.body.name
  });
  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    });
//      userModel.register(userdata,req.body.password)
// .then(function(registereduser){
//   passport.authenticate("local")(req,res,function(){
//     res.redirect("/profile");
  });
});
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){
})
router.get("/logout",function(req,res){
req.logout(function(err){
  if(err){
    return next(err);
  }
  res.redirect("/");
});
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/")
}
module.exports = router;

