const {Server,EVENTS} = require('@tus/server') //get the server protocol mounter
const {FileStore} = require('@tus/file-store') //get the storage area
const fs=require('fs');


const mongoose=require('mongoose')
const mediaSchema=require('./schema').mediaSchema;
const Media=mongoose.model('Media',mediaSchema);

///thiss storage area can also be replaced by s3 and

const host = '127.0.0.1' // select local host for server
const port = 1080
const server = new Server({
  path: '/files', //give path
  datastore: new FileStore({directory: './files'}), //return a directory that will give the values
  
})
server.on(EVENTS.POST_FINISH,async(req,res,upload)=>{//EVENTS contains all the event's on this server
  console.log('upload'+upload);
  await fs.rename(__dirname+'/files/'+upload.id,__dirname+'/files/'+upload.id+'.'+upload.metadata.filetype.split('/')[1],(e)=>{});
  await Media.create({fileName:upload.id,filePath:'/files/'+upload.id+'.'+upload.metadata.filetype.split('/')[1],mimeType:upload.metadata.filetype,creationDate:new Date(),owner:upload.metadata.id})
})

 

server.listen({host, port}) //make the tus server listen for file upload's

mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});