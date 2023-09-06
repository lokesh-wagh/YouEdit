//this is the plan for downloading and showing the video to creator
//this will not hold any other functionality
//so this means that port=3000 streams and download's video
// port 5717 serves frontend
// port 5000 send's to youtube
// port 8000 would be the general backend port where mongodb talk's and othertrivial thing's would happen
const path=require('path');
const archiver=require('archiver');

const express = require('express');
const fs = require('fs');

const { default: mongoose } = require('mongoose');
const Media=mongoose.model('Media',require('./schema').mediaSchema);
const VideoTask=mongoose.model('Videotasks',require('./schema').videoTaskSchema);
const User=mongoose.model('User',require('./schema').finalUserSchema);

const app = express();
const port = 3000;
app.get('/download',async(req,res)=>{
        const file=await Media.findOne({fileName:req.query.id});
        const filePath = file.filePath //------->change both of these hardcoded value's 
        const fileName =file.fileName+'.'+file.mimeType.split('/'); 
      
       
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        //to convert data being sent into download we have to write content dispossitonn and convert that into attachment
      
        res.setHeader('Content-Type', 'video/mp4');//----->change this hardcoded value
       
        const fileStream = fs.createReadStream(filePath); //create a readstream from the file
        fileStream.pipe(res);// pipe the read streak to response so that it can be downloaded
        
     
})

app.get('/delete',async(req,res)=>{
  console.log(req.query);
  const file=await Media.findOne({fileName:req.query.fileid});
  
  const videotask=await VideoTask.findOne({id:req.query.taskid});

  const user=await User.findOne({googleId:req.query.userid});
  const filePath=file.filePath;
  if (fs.existsSync(filePath)) {
    // Use fs.unlink to delete the file
    fs.unlink(filePath,async (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        user.tasks.forEach((task) => {
          if (task.id == req.query.taskid) {
            
            task.resources = task.resources.filter((resource) => resource.media.fileName !== req.query.fileid);
          }
        });
        videotask.resources = videotask.resources.filter((resource) => resource.media.fileName !== req.query.fileid);
        await Media.deleteOne({fileName:req.query.fileid});
        
        await videotask.save();
        await user.save();
        res.status(200);
        console.log('File deleted successfully');
      }
    });
  } else {
    res.status(400);
    console.log('File does not exist.');
  }
  
})
app.get('/stream', async(req, res) => {
        const file=await Media.findOne({fileName:req.query.id});
        const filePath = file.filePath //------->change both of these hardcoded value's 
        const fileName =file.fileName+'.'+file.mimeType.split('/'); 
  
  const stat = fs.statSync(filePath);//read stat's of the file synchronoulsy
  const fileSize = stat.size;// tell the source tag what the size would be

  const range = req.headers.range;//we need range to know from where to where  we need to read
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-'); //split and get the value
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;//create point's

    const chunkSize = (end - start) + 1; //create a chunk data
    const file = fs.createReadStream(filePath, { start, end });//create a stream for the required chunk
    
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,  //give the necessary header to source tag
      'Content-Type': 'video/mp4', // ---->remove this hardcode
    });

    file.pipe(res); //pipe the stream to source tag
  } else {
      res.writeHead(200, {//if range was not provided entire video wiil be read and piped
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4', //--------> change this hard coded value
      });
      fs.createReadStream(filePath).pipe(res);//pipe the entire video
  }
});


app.get('/thumbnail',async (req, res) => {
        const file=await Media.findOne({fileName:req.query.id});
        const filePath = file.filePath //------->change both of these hardcoded value's 
        const fileName =file.fileName+'.'+file.mimeType.split('/'); 
  const fileExtension = path.extname(filePath);

  // Determine the content type based on the file extension
  const contentType = getContentType(fileExtension);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading thumbnail:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
      });
      res.end(data);
    }
  });
});

// Function to determine content type based on file extension
function getContentType(fileExtension) {
  switch (fileExtension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    // Add more cases for other image formats if needed
    default:
      return 'application/octet-stream'; // Default to binary data
  }
}
app.get('/download-zip', async(req, res) => {
  // console.log(req.query);
  const tasks=await VideoTask.findOne({id:req.query.id});
  if(tasks!=null){    // console.log(tasks);
    const resources =tasks.resources;
  
  
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=example.zip');
  

    const archive = archiver('zip', {
      zlib: { level: 9 }, 
    });
  
  
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
    
        console.warn(err.message);
      } else {
    
        throw err;
      }
    });
  
    archive.on('error', (err) => {
      throw err;
    });
  
    archive.pipe(res);
    console.log(resources);
    resources.forEach((resource) => {
      const file = path.basename(resource.media.filePath);
      archive.file(resource.media.filePath, { name: file }); 
    });
  
  
    archive.finalize();
}
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`); //listen on the specified port
});

mongoose.connect("mongodb://127.0.0.1:27017/YouEdit").then(()=>{console.log("connected")});