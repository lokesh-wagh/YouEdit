require('dotenv').config();
const mongoose=require('mongoose');
const { backend , port} = require('./app');
const { serve , serveport } = require('./serve')
const { tusserver , tusport } = require('./tus')
const { youtubeServer , youtubeport } = require('./youtube')
backend.listen(port,()=>{
    console.log("Backend is Active at " + port);
})
serve.listen(serveport , () => {
    console.log("Media Server is Active at " + serveport);
})
tusserver.listen(tusport , () => {
    console.log("Tus Server is active at " + tusport)
})
youtubeServer.listen(youtubeport,() => {
    console.log("Youtube is Active at " + youtubeport );
})

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("connected")
});