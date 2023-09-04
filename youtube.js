
//this file handle's upload from disk to youtube
// just do nodemon youtube.js for this

/*
    1. create a oauth client (this is specific to our api usage)
    2. then the we generate a auth url requesting certain scope's
    3. on making a request to this auth url we transefer the authentication control to googlr and get required permission
    4. google callback's on the uri that we registered
    5. over server recieves a authorization code in the parameter's
    6. then we use the oauthCliennt object to get the token's
    7. we get a refresh token and a acces token
    8. then we put this token object in our auth.client object in oauthclient.credentials 
    9. then when making api request to google we put this oauthclient in auth: header 


*/

// Replace with your own credentials and desired scopes
require('dotenv').config();
const fs=require('fs');

const videoFilePath=__dirname+'/files/7903e08b7d818b1e34acf5f1bb884117.mp4'; //change this to upload certain video
const CLIENT_ID = '246767017361-mtbn59kuptu1fck5deak517j21t4ul64.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5000/google'; //change the url if needed
const axios=require('axios');

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/userinfo.profile'];//add some more scopes if needeed
const { google } = require('googleapis');
const express = require('express');


const mongoose = require('mongoose');


const userSchema = require('./schema').finalUserSchema;

const User = mongoose.model('User', userSchema);





const youtubeServer = express();



const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);//intiializing oauth object


const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,// heere we authorize ourselves to acces youtube
});
//login flow react to youtube
youtubeServer.get('/login', (req, res) => {

  res.redirect(authUrl);  //redirect the guy to authorize
});

youtubeServer.get('/google', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token; // get the tokens's
    var auth=oauth2Client;
    auth.credentials=tokens;
    console.log(tokens);
    //we can use the refresh token to refresh our accesss however for a psychological perpective
    // i want the creator  to physically consent me to upload the video



    const people = google.people({ version: 'v1', auth:auth });

    // Get the user's profile information
    var googleid;
    people.people.get({
      resourceName: 'people/me',
      personFields: 'metadata,names,emailAddresses',
    })
    .then(async(response) => {
      const userProfile = response.data;
      console.log('User profile:', userProfile.metadata);
      googleid=userProfile.metadata.sources[0].id;
      console.log(googleid);
      const user=await User.findOne({googleId:googleid});
      if(user==null){
        // res.send('User does not exist in database and was created');
        await User.create({googleId:googleid,Token:tokens});
      }
      else{
        user.Token=tokens;
        await user.save();
      }
    })
   
  

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error during authentication');
  }
});
//upload flow  react to app app send's user name and file to be uploaded  details then youtube acceses them
youtubeServer.get('/upload',async (req,res)=>{
    const user=await User.findOne({googleId:req.query.userid});
    if(user==null){
      res.send('user not found');
      res.end();
    }
    else{
    const service = google.youtube('v3') //this service is used to upload


    const tokens=user.Token;
    const accessToken = tokens.access_token;
    const refreshToken = user.refresh_token; // get the tokens's
    var auth=oauth2Client;
    auth.credentials=tokens;

    const title="rain";
    const description='editted rain  footage'
    const tags=['eductaional']; //this is the metadata would normally be retrived fromm mongodb


    service.videos.insert({ //make a call to youtube adding a vide0
      auth: auth, //here provide the oauthobject + credential token
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title,
          description,
          tags, //just some metadata
         
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en'
        },
        status: {
          privacyStatus: "private" //change to public in production
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath), //this is file stream being piped to youtube
      },
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      console.log(response.data)
      // here you are supposed to handle thumbnail upload
     
      
    });
    }
  })

  mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});

  youtubeServer.listen(process.env.youtubePort,()=>{
    //listen on 5500
    //when /login would be triggered the user would give the permission to upload the file and it would be uploaded
    console.log('listening on '+process.env.youtubePort);
  })