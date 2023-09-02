
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
const fs=require('fs');

const videoFilePath=__dirname+'/files/27f1dc60fd35b34e1bb535d02c1f4b79.mp4'; //change this to upload certain video
const CLIENT_ID = '246767017361-mtbn59kuptu1fck5deak517j21t4ul64.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5000/google'; //change the url if needed


const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];//add some more scopes if needeed
const { google } = require('googleapis');
const express = require('express');


const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  googleId: String,
  accessToken: String,
  refreshToken: String,
});

const User = mongoose.model('User', userSchema);





const app = express();
const port = 5000;


const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);//intiializing oauth object


const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,// heere we authorize ourselves to acces youtube
});

app.get('/login', (req, res) => {

  res.redirect(authUrl);  //redirect the guy to authorize
});

app.get('/google', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token; // get the tokens's
    var auth=oauth2Client;
    auth.credentials=tokens;
 



    const user = new User({
     
      accessToken, //store tokens(give id and other detail's)
      refreshToken,//would add some 
    });

    await user.save();
    const service = google.youtube('v3') //this service is used to upload



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
  

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error during authentication');
  }
});

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    //coonect to mongodb
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  app.listen(port,()=>{
    //listen on 5000
    //when /login would be triggered the user would give the permission to upload the file and it would be uploaded
    
  })