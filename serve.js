//this is the plan for downloading and showing the video to creator
//this will not hold any other functionality
//so this means that port=3000 streams and download's video
// port 5717 serves frontend
// port 5000 send's to youtube
// port 8000 would be the general backend port where mongodb talk's and othertrivial thing's would happen

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.get('/download',(req,res)=>{
   
        const filePath = __dirname+'/files/27f1dc60fd35b34e1bb535d02c1f4b79'; //------->change both of these hardcoded value's 
        const fileName = 'ghanta.mp4'; 
      
       
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        //to convert data being sent into download we have to write content dispossitonn and convert that into attachment
      
        res.setHeader('Content-Type', 'video/mp4');//----->change this hardcoded value
       
        const fileStream = fs.createReadStream(filePath); //create a readstream from the file
        fileStream.pipe(res);// pipe the read streak to response so that it can be downloaded

     
})


app.get('/stream', (req, res) => {
  const filePath = __dirname+'/files/27f1dc60fd35b34e1bb535d02c1f4b79'; //-->change this hardcoded value
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); //listen on the specified port
});