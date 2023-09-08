const {Server,EVENTS} = require('@tus/server') //get the server protocol mounter
const {FileStore} = require('@tus/file-store') //get the storage area
const fs=require('fs');

const path=require('path');
const mongoose=require('mongoose');

const mediaSchema=require('./schema').mediaSchema;

const User=mongoose.model('User',require('./schema').finalUserSchema);
const Media=mongoose.model('Media',mediaSchema);
const YoutubeBundle=mongoose.model('Bundle',require('./schema').youtubeBundleSchema);
const VideoTask=mongoose.model('VideoTask',require('./schema').videoTaskSchema);

///thiss storage area can also be replaced by s3 and

const host = '127.0.0.1' // select local host for server
const port = 1080
const server = new Server({
  path: '/storage', //give path
  datastore: new FileStore({directory: '../storage'}), //return a directory that will give the values
  
})



// find a way for sever to stop refreshing
server.on(EVENTS.POST_FINISH,async(req,res,upload)=>{//EVENTS contains all the event's on this server
  
  try{
   
      await fs.rename('C:/Users/lokes/Desktop/YouEdit/storage'+'/'+upload.id,'C:/Users/lokes/Desktop/YouEdit/storage'+'/'+upload.id+'.'+upload.metadata.filetype.split('/')[1],(e)=>{});

    
  
      const recent=await Media.create({fileName:upload.id,filePath:'C:/Users/lokes/Desktop/YouEdit/storage'+'/'+upload.id+'.'+upload.metadata.filetype.split('/')[1],mimeType:upload.metadata.filetype,creationDate:new Date(),owner:upload.metadata.id})
      //inserting the media in appropriate place
      
     
      console.log(upload.metadata);
      if(upload.metadata.role=='orignalvideo'){
        const task=await VideoTask.findOne({id:upload.metadata.TaskCode});
        task.orignalVideo=recent;
        await task.save();
      }
      if(upload.metadata.role=='resource'){
        const task=await VideoTask.findOne({id:upload.metadata.TaskCode});
        task.resources.push({media:recent,description:"not decided yet"});
        await task.save();
      }
      if(upload.metadata.role=='editedThumbnail'){
        var user=await User.findOne({googleId:upload.metadata.bundlereciever})
        var bundle=await YoutubeBundle.findOne({id:upload.metadata.YoutubeCode});
        if(bundle==null){
          bundle=await YoutubeBundle.create({id:upload.metadata.YoutubeCode});
          console.log('bundle created');
        }
        else{
          console.log('bundle found');
        }
        bundle.thumbnail=recent;
        bundle.taskid=upload.metadata.TaskCode;
        for(let i=0;i<user.videoOrdersUploaded.length;i++){
          if(user.videoOrdersUploaded[i].taskid==upload.metadata.TaskCode){
            user.videoOrdersUploaded[i]=bundle;
            count=1;
          }
        }
       
        if(count==0){
          user.videoOrdersUploaded.push(bundle);
        }
        await bundle.save();
        await user.save();
      }
      if(upload.metadata.role=='editedVideo'){
        console.log(upload.metadata);
        var user=await User.findOne({googleId:upload.metadata.bundlereciever})
        var bundle=await YoutubeBundle.findOne({id:upload.metadata.YoutubeCode});
      
     
        if(bundle==null){
          bundle=await YoutubeBundle.create({id:upload.metadata.YoutubeCode});
          console.log('bundle created');
        }
        else{
          console.log('bundle found');
        }
        bundle.video=recent;
        bundle.taskid=upload.metadata.TaskCode;
       
        console.log(user.videoOrdersUploaded);
        var count=0;
        for(let i=0;i<user.videoOrdersUploaded.length;i++){
          if(user.videoOrdersUploaded[i].taskid==upload.metadata.TaskCode){
            user.videoOrdersUploaded[i]=bundle;
            count=1;
          }
        }
        console.log(count);
        if(count==0){
          user.videoOrdersUploaded.push(bundle);
        }
        console.log(user);
        await bundle.save();
        await user.save();
      }
     
  
}
catch(e){

 console.log(e);
}
 
})

 

server.listen({host, port}) //make the tus server listen for file upload's

mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});