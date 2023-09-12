
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

 //change this to upload certain video

const REDIRECT_URI = 'http://localhost:5000/google'; //change the url if needed
const axios=require('axios');

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/userinfo.profile'];//add some more scopes if needeed
const { google } = require('googleapis');
const express = require('express');


const mongoose = require('mongoose');


const userSchema = require('./schema').finalUserSchema;

const User = mongoose.model('User', userSchema);





const youtubeServer = express();



const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID_YOUTUBE, process.env.CLIENT_SECRET_YOUTUBE, REDIRECT_URI);//intiializing oauth object

/*
  final flow
  from upload button ({taskid,bundleid,and userid,editorid}) ye ayaega
  sara data stringify hoke state main jayega
  phir stringified data json main convert hoke we after getting access token we will call upload and procced as normal
  then close this request
*/


//login flow react to youtube
youtubeServer.get('/login', (req, res) => {
  console.log('at login')
  console.log(req.query);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,// heere we authorize ourselves to acces youtube
    state:req.query.bundle
  });
  res.redirect(authUrl);  //redirect the guy to authorize
});

youtubeServer.get('/google', async (req, res) => {
  const { code } = req.query;
  console.log(req.query);
  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token; // get the tokens's
    var auth=oauth2Client;
    auth.credentials=tokens;
   
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
      
      googleid=userProfile.metadata.sources[0].id;
      console.log('google id is '+googleid);
      const user=await User.findOne({googleId:googleid});
      if(user==null){
        // res.send('User does not exist in database and was created');
        await User.create({googleId:googleid,Token:tokens});
      }
      else{
        user.Token=tokens;
        await user.save();
      }
      const state=JSON.parse(req.query.state);
      console.log(state);
      axios
      .get(`http://localhost:5000/upload`,{params:{
        url:state.video.filePath,
        userid:googleid,
        thumbnailpath:state.thumbnail.filePath,
      }} )
      .then((response) => {
        // Handle the server's response here
        
        console.log('Server Response:', response.data);
        
      }
      )
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Error:', error.message);
      });
  
      res.redirect('http://localhost:5173/previous-task');
    })
   
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error during authentication');
  }
});


//upload flow  react to app app send's user name and file to be uploaded  details then youtube acceses them
youtubeServer.get('/upload',async (req,res)=>{
  console.log(req.query);
  const videoFilePath=req.query.url;
  
  console.log('query parameters in upload are')
  console.log(req.query);
    const user=await User.findOne({googleId:req.query.userid});
    if(user==null){
      res.send('user not found');
      res.end();
    }
    else{
    const service = google.youtube('v3') //this service is used to upload


    const tokens=user.Token;
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token; // get the tokens's
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
    }, async function(err, response) {
      if (err) {
        res.send('The API returned an error: ' + err);
        return;
      }
      console.log(response.data)
      // here you are supposed to handle thumbnail upload
      const videoId = response.data.id;
      const thumbnailResponse = await service.thumbnails.set({
        auth: auth,
        videoId: videoId,
        media: {
          mimeType: 'image/png', // Adjust the MIME type if needed
          body: fs.createReadStream(req.query.thumbnailpath), // This is the file stream being piped as the thumbnail
        },
      });
      console.log('Thumbnail uploaded successfully:', thumbnailResponse.data);
      
    });
    }
  })

  mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});

  youtubeServer.listen(5000,()=>{
    
    //when /login would be triggered the user would give the permission to upload the file and it would be uploaded
    console.log('youtube is listening on '+5000);
  })