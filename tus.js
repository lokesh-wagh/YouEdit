const {Server} = require('@tus/server') //get the server protocol mounter
const {FileStore} = require('@tus/file-store') //get the storage area
///thiss storage area can also be replaced by s3 and

const host = '127.0.0.1' // select local host for server
const port = 1080
const server = new Server({
  path: '/files', //give path
  datastore: new FileStore({directory: './files'}), //return a directory that will give the values
  
})

//i plan to use the event listener's on server here to perform necessary process to the uploaded file's

server.listen({host, port}) //make the tus server listen for file upload's