/* 
    1. centralize all the 4 (done)
      
        for streaming a video make a endpoint redirect it to serve.js(done)
        for downloading make a endpoint redirect it(done)
        for uploading a youtube create a endpoint redirect it(done)
        No endpoint for tus tus would be directly communicated by frontend itself(done)
        changed my mind on redirecting

    2. integrate passport js , session to log the user's and editor's in(done)
    
    3. design a schema for all the  view's how they are going to work
        who will interact with what and so on (done)
    
    4. code all the view's
    
    5. design the mongoose schema(done)

    6. implement findOrCreate logic in youtube for the token's to avoid unnecssary re-authorization(done/bypassed)

    7. find a way to get google id along with the token's so that you know whose access you have(done)

    8. implement crud operation's on mongoose schema in appropriate place's

    9.create a component for tus upload (done)

    10. learn how authentication would work(done)

    11. implement authentication(done)

    12.perform the proper crud operation when a media is uploaded(done)

    13.code previous task view(done)

    debug all of creator view's(done)

    14.code hire view (only hire view and dashboard is needed for editor)

    15.code editor dashboard with list's then a download video button a download resource button and a upplooad button that change's the view(done)

    16.design editor side(done)

    17.create a design to beautify entire website(where to nest which component)

    18.apply styling

    19.decide on which external UI to use(done)

    20.design finalize view for creator

    21. code finalize view for creator (show all the edited video create a api request for the same)

    22.  figure out how to use youtube .js to do the same
*/
require('dotenv').config();

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const axios=require('axios');


const VideoTask=mongoose.model('VideoTask',require('./schema').videoTaskSchema);
const User = mongoose.model('User',require('./schema.js').finalUserSchema);
const YoutubeBundle=mongoose.model('Bundle',require('./schema.js').youtubeBundleSchema);
const EditorProfile=mongoose.model('Editors',require('./schema').EditorProfile);

const cors=require('cors')
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your client's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
    next();
  });

//--------------------------passport configuration section-----------------------
const bcrypt=require('bcrypt');

const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const session=require('express-session');

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:8000/auth/google",
    
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },async(accesstoken,refreshtoken,profile,done)=>{
        //these accesstoken and refreshtoken cannot be used by us so that's a problem
        console.log(profile);
        var user=await User.findOne({googleId:profile.id});
    
        if(user==null){
          await User.create({googleId:profile.id,username:profile.displayName,email:profile.emails[0].value,profileURL:profile.photos[0].value}); 
        }
        user=await User.findOne({googleId:profile.id});
        user.profileURL=profile.photos[0].value;
        if(user.registeredAsEditor==null){
          user.registeredAsEditor=false;
        }
        await user.save();
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

  app.get('/logout',(req,res)=>{
    if(req.isAuthenticated()==true){
      req.logOut((err)=>{
        console.log('signed out')
        res.send('OK');
        res.end();
      });
    }
   
  })

  app.get('/auth/google',passport.authenticate('google',{successRedirect:'/',failureRedirect:'/login',scope:['profile','email']}))
 
  app.get('/auth/status',(req,res)=>{
    
    
    res.send(req.isAuthenticated());
  })

  app.get('/',(req,res)=>{
  
    console.log('at /');
    

    if(req.isAuthenticated()){
        
        res.redirect('http://localhost:5173/'); 
    }
    else{
        res.redirect('/google')
    }
  })


  app.get('/registerEditor',async(req,res)=>{
    const user=await User.findOne({googleId:req.query.googleId});
    const profile=await EditorProfile.create({
      googleId:user.googleId,
      rating:'3',
      rates:req.query.rates,
      qualifications:req.query.qualification,
      description:req.query.descriptionEditor,
      worksAssigned:'0',
      worksCompleted:'0',
      skills:req.query.skills,
      profileURL:user.profileURL,
      username:user.username,
    })
    user.editorProfile=profile;
    user.registeredAsEditor=true;
    await user.save();
  })
  app.get('/user',(req,res)=>{
    
    if(!req.isAuthenticated()){
       
        res.status(500).json({error:'not authenticated'});
    }
    else{
       
      
        res.send(req.user);
        res.end();
    }
  })
  app.get('/createtask',async (req,res)=>{
     const task=await VideoTask.create({creator:req.user,id:code()});
     res.send(task.id);
  })

  app.get('/finishtask',async (req,res)=>{
   


    const task=await VideoTask.findOne({id:req.query.code});
    const user=await User.findOne({googleId:req.query.id});
    const count=0;
    console.log(user.tasks);
    for(let i=0;i<user.tasks.length;i++){
      
      if(user.tasks[i].code==req.query.id){
      
        count++
      }
    }
    
    if(count==0){
      user.tasks.push(task);
      user.save()
    }
    res.end();
  })


app.get('/createbundle',async(req,res)=>{
    const bundle=await YoutubeBundle.create({editor:req.user,id:code()});
     res.send(bundle.id);
})
app.get('/finishbundle',async(req,res)=>{
  
  const bundle=await YoutubeBundle.findOne({id:req.query.code});
  const task=await VideoTask.findOne({id:bundle.taskid});
  const user=await User.findOne({googleId:req.query.id}); //here user represent's the owner
  const editor=await User.findOne({googleId:req.user.googleId});
  editor.videoOrdersUploaded.push(bundle);
  await editor.save();
  var count=0;
  
  console.log(bundle);
  console.log(task);
  console.log(user);
  for(let i=0;i<task.editedVideo.length;i++){
    
    if(task.editedVideo[i].id==req.query.code){
      task.editedVideo[i]=bundle;
      count=1;      
    }
  }
  
  if(count==0){
    task.editedVideo.push(bundle);
    await  task.save();
  }
  for(let i=0;i<user.tasks.length;i++){
    if(user.tasks[i].id==bundle.taskid){
      user.tasks[i]=task;
    }
  }
  await user.save();
  res.end();
})

app.get('/hireList',async (req,res)=>{
  try {///here implement search engine logic
   
    const firstThreeUsers = await User.find().limit(6);
    const responseObject = await Promise.all(firstThreeUsers.map(async (user) => {
      const obj = await EditorProfile.findOne({ googleId: user.googleId });
      console.log(obj);
      return obj;
    }));
    console.log(responseObject);
    res.send(responseObject);
  } catch (error) {
    console.error('Error fetching first three users:', error);
    throw error; 
  }
})

app.get('/hire',async (req,res)=>{
  console.log(req.query);
  const user=await User.findOne({googleId:req.query.ownerid});
  const editor=await User.findOne({googleId:req.query.editorid});
  for(let i=0;i<user.tasks.length;i++){
    if(user.tasks[i].id==req.query.taskid){
      var count=0;
      for(let j=0;j<user.tasks[i].editors.length;j++){
        if(user.tasks[i].editors[j].googleId==req.query.editorid){
          count=1;
        }
      }
      if(count==0){
        user.tasks[i].editors.push(editor);
        var task=await VideoTask.findOne({id:user.tasks[i].id});
        task.editors=user.tasks.editors;
        editor.videoOrdersAssigned={order:task,ownerid:user.googleId};
        await user.save();
        await task.save();
        await editor.save();
       
       
      }
    }
  }
 
  
  res.send('success')
})
  port=8000;

 
app.listen(port,()=>{
    console.log('listening on port '+port);
})



function code(){//random code is genertaed
  var otp="";
  const rounds=12;
    for(let i=0;i<rounds;i++){
   otp=otp+Math.floor(Math.random()*10);
  
  }
  return otp;
}
mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});