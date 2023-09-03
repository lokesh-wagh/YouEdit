/* 
    1. centralize all the 4 
        for streaming a video make a endpoint redirect it to serve.js
        for downloading make a endpoint redirect it
        for uploading a youtube create a endpoint redirect it
        No endpoint for tus tus would be directly communicated by frontend itself

    2. integrate passport js , session to log the user's and editor's in
    
    3. design a schema for all the  view's how they are going to work
        who will interact with what and so on
    
    4. code all the view's
    
    5. design the mongoose schema(done)

    6. implement findOrCreate logic in youtube for the token's to avoid unnecssary re-authorization

    7. find a way to get google id along with the token's so that you know whose access you have

    8. implement crud operation's on mongoose schema in appropriate place's

    9.create a component for tus upload (done)

    10. learn how authentication would work(done)

    11. implemebt authentication



*/
require('dotenv').config();

const express=require('express');
const app=express();
const mongoose=require('mongoose');

const User = mongoose.model('User',require('./schema.js').finalUserSchema);
const cors=require('cors')
app.use(cors());

//--------------------------passport configuration section-----------------------
const bcrypt=require('bcrypt');

const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const session=require('express-session');
// console.log(process.env.CLIENT_ID);
passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:8000/auth/google",
    
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },async(accesstoken,refreshtoken,profile,done)=>{
        //these accesstoken and refreshtoken cannot be used by us so that's a problem
        // console.log(profile);
        var user=await User.findOne({googleId:profile.id});
    
        if(user==null){
          await User.create({googleId:profile.id,username:profile.displayName,email:profile.emails[0].value}); 
        }
        user=await User.findOne({googleId:profile.id});
      return done(null,user);
   
  }));
  
  
  passport.use(new LocalStrategy({usernameField:'username',passwordField:'password'},async (username,password,done)=>{
    try{
      const user=await User.findOne({username:username});
      console.log("here");
      if(user==null){
          done(null,false,{message:"no such user exists"});
      }
      else{
        const flag=await bcrypt.compare(password,user.password);
        if(flag){
          done(null,user);
        }
        else{
          done(null,false,{message:"password is incorrect"});
        }
      }
     
  }
  catch{
      done(null,false,{message:"something went wrong"});
  }
  }));
  
  passport.serializeUser((user,done)=>{
    done(null,user._id);
  });
  passport.deserializeUser(async (userid,done)=>{
    const user=await User.findOne({_id:userid});
    
    return done(null,user);
  })
  
  app.use(session({
   secret:'mahesh dalle',
   resave:false,
   saveUninitialized:false,
  
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/google',passport.authenticate('google',{scope:['profile','email']})); //frontend make's a request here


  app.get('/auth/google',passport.authenticate('google',{successRedirect:'/',failureRedirect:'/login'}))
 
  app.get('/',(req,res)=>{
  
    console.log('at /');
    console.log(req.user);
    if(req.isAuthenticated()){
        
        res.redirect('http://localhost:5173/'); 
    }
    else{
        res.redirect('/google')
    }
  })
  

  port=8000;




app.listen(port,()=>{
    console.log('listening on port '+port);
})

mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});