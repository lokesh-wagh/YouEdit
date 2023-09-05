const {Server,EVENTS} = require('@tus/server') //get the server protocol mounter
const {FileStore} = require('@tus/file-store') //get the storage area
const fs=require('fs');

const path=require('path');
const mongoose=require('mongoose');
const mediaSchema=require('./schema').mediaSchema;
const Media=mongoose.model('Media',mediaSchema);

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
      const task=await VideoTask.findOne({id:upload.metadata.TaskCode});
      console.log(task);
      console.log(upload.metadata);
      if(upload.metadata.role=='orignalvideo'){
        task.orignalVideo=recent;
      }
      else{
        task.resources.push({media:recent,description:"not decided yet"});
      }
      await task.save();
  
}
catch(e){


}
 
})

 

server.listen({host, port}) //make the tus server listen for file upload's

mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});