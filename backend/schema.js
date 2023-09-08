/* 
    1. media schema for all the media's that are sent
         a. filename that user know's
         b. filepath 
         c. creation date
         d. mimeType
         e. owner/uploader

    2. a videoTask schema for when creator create's a task 
        this should have 
            a. creator's info(user schema)
            b. resources 
            c. a chatroom data where they can talk
            d. the video data(media schmea) of orignal video
            e. editor's info
            f. video data array for edited(youtube bundle)
            g. final video uploaded by creator (youtube bundle)
            h. status of this task (assigned,created,working,completed)
                completed means video has been sent to youtube all edited video and uploaded video deleted
                created means task has been created and no editor is added yet but all resource's are uploaded
                working mean's all the editor's are assigned and no more will be added
                assigned mean's editor's have been hired but could still be hired in  futue 

    3. a userschema that has
        a. username
        b. google id
        c. password
        d. email
        e. role
        f. profile pic(media for photo)

    4. then get chat schema for message's and shit
    5. youtube bundle
        this thing contain's all the information needed to upload something to youtube
            1. video mediaschema
            2. thumbnail mediaschema (could be a array)
            3. a json object with youtube meta dat like tag's categorie's
            4.uploading editor
*/
// i know that the schema is redundant will optimize it later


const mongoose=require('mongoose');


// when the user land's on page we get userSchema object from role we get editor or creator object
  const  userSchema=new mongoose.Schema({
    username:String,
    googleId:String,
    password:String,
    email:String,
    role:String,
    profilePic:String,//just have the file path
   
})



const mediaSchema=new mongoose.Schema({//this schema is internally used to get resorces from disk
    fileName:String, //this is the name that user had in his device
    filePath:String,
    creationDate:Date,
    mimeType:String,
    owner:String , //will decide to put schema or something else in this

})
 const youtubeBundleSchema=new mongoose.Schema({
    id:String,
    editor:userSchema, //used everytime a editor upload's a video
    video:mediaSchema,
    thumbnail:mediaSchema,
    metaData:{
            tag:String,
            description:String,
            title:String,

        },
    taskid:String,
})

// ------------- exposed to frontend section ------------------///////////
 const videoTaskSchema=new mongoose.Schema({
    id:String,
    creator:userSchema,
    resources:[{media:mediaSchema,description:String}],
    orignalVideo:mediaSchema,
    chatRoomId:String,          //this schema will be exposed to frontend
    editors:[userSchema],
    editedVideo:[youtubeBundleSchema],
    finalVideo:youtubeBundleSchema,
    status:String,

})
const finalUserSchema=new mongoose.Schema({
    username:String,
    googleId:String,
    password:String,
    email:String,
    role:String,
    profilePic:String,//
    Token:Object,
    tasks:[videoTaskSchema],//given by the user to editors
    videoOrdersUploaded:[youtubeBundleSchema],//editor uploaded will be here
    videoOrdersAssigned:[{order:videoTaskSchema,ownerid:String}],//editor's would see from these order's
})



////////////-----------------------------------------------///////////////////
module.exports = {
    userSchema,
    mediaSchema,
    youtubeBundleSchema,
    videoTaskSchema,
    finalUserSchema,
 
    
  };