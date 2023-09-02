const {Server,EVENTS} = require('@tus/server') //get the server protocol mounter
const {FileStore} = require('@tus/file-store') //get the storage area
const fs=require('fs');
///thiss storage area can also be replaced by s3 and

const host = '127.0.0.1' // select local host for server
const port = 1080
const server = new Server({
  path: '/files', //give path
  datastore: new FileStore({directory: './files'}), //return a directory that will give the values
  
})
server.on(EVENTS.POST_FINISH,async(req,res,upload)=>{//EVENTS contains all the event's on this server
  console.log(upload);
  
  await fs.rename(__dirname+'/files/'+upload.id,__dirname+'/files/'+upload.id+'.'+upload.metadata.filetype.split('/')[1],(e)=>{});
})

server.listen({host, port}) //make the tus server listen for file upload's