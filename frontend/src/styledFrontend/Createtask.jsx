

import { useRef,useEffect, useState } from 'react';
import axios from 'axios';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';

import { useTheme} from '@mui/material/styles';
import {Card,CardContent,CardHeader} from '@mui/material'
import {Grid} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { BACKEND_URL , FRONTEND_URL, SERVE_URL,YOUTUBE_URL,TUS_URL } from '../config';
export default function CreateTask({ User }) {
    const [taskCode,setTaskCode]=useState(null); 
    const theme=useTheme(); 
  function handleSubmit()
    { console.log(taskCode)
      console.log(User.googleId);
      if(taskCode==null){
        return;
      }
      axios.get(BACKEND_URL + '/finishtask',{params:{
        code:taskCode,
        id:User.googleId,
      }}).then(()=>{
        window.location.href=FRONTEND_URL + '/creator/previous-task';
      })
    } 
    useEffect(()=>{
      axios.get(BACKEND_URL + '/createtask').then((res)=>{
        console.log(res.data);
        setTaskCode(res.data);
      })
    },[]) 
    return (
        <div style={{marginTop:'15%',marginLeft:'25%'}}>
   <Grid container spacing={4}>
    <Grid item xs={12} md={6} lg={4}>
    <Card elevation={1} style={{border:'2px solid gold'}}>
        <CardHeader
          
          
          title={ 'Upload Video'}
          subheader={ 'Upload your video here'}
        />
        <CardContent>
            <Upload User={User} code={taskCode} role={'orignalvideo'}/>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6} lg={4}>
    <Card elevation={1} style={{border:'2px solid gold'}}>
        <CardHeader
          
          
          title={ 'Upload Resources'}
          subheader={ 'Upload your resources here:'}
        />
        <CardContent>
            <Upload User={User} code={taskCode} role={'resource'}/>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12}>
       
         
      
         
      <IconButton onClick={handleSubmit} style={{position:'absolute',bottom:'10vh',right:'5vw'}} >
        <AddCircleIcon style={{fontSize:'100px',color:'gold'}}></AddCircleIcon>
      </IconButton>
    </Grid>
  
   
      </Grid>  
      </div>
  );
}


import * as tus from 'tus-js-client'


 function Upload({User,code,role,bundlereciever,ycode}) {
    const theme=useTheme();
    const [upload,setUpload]=useState(null);
    const [data,setData]=useState('no file selected');
    const inputRef=useRef(null);
    const pauseButtonRef=useRef(null);
    const resumeButtonRef=useRef(null);
    const googleid=User.googleId;
  
    function handleFileChange(){
   
            

     

      
        pauseButtonRef.current.disabled=false;
        resumeButtonRef.current.disabled=false; //enable button's when new file selected
        if(inputRef.current.files[0]!=null){
          setData(inputRef.current.files[0].name+' is selected'); //display that file is selected
        }
        setUpload (new tus.Upload(inputRef.current.files[0], {
            endpoint: TUS_URL + "/storage/",
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
              filename: inputRef.current.files[0].name,
              filetype:inputRef.current.files[0].type,
              id:googleid,
              TaskCode:code,
              role:role,
              bundlereciever:bundlereciever==null?'nobody':bundlereciever,
              YoutubeCode:ycode==null?'nobody':ycode,
            },
            chunkSize:100000,
            removeFingerprintOnSuccess:true,
            onError: function(error) {
              setData("Failed because: " + error) //display error
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                
                setData(percentage + '%');
              },
            onSuccess: function() {
                pauseButtonRef.current.disabled=true;
                resumeButtonRef.current.disabled=true;
                setData('Upload completed successfully \n select a new file to unlock resume and pause\n');
                
            }
        })
        )

        

        
            
  }


  function stopUpload(){
    if(upload!=null){
        upload.abort();
    }
  }
  function openUploader(){
    inputRef.current.click();
  }

  function resumeUpload() {
        if(upload!=null){
        
            upload.findPreviousUploads().then(function (previousUploads) {
               
                if (previousUploads.length) {
                    upload.resumeFromPreviousUpload(previousUploads[0])
                }

           
                upload.start()
            })
        }
    }
   
  return (
    <Container>
        <Typography>

          {data}
        </Typography>
        <input style={{display:'none'}} ref={inputRef} type="file" id="file" name="file" onChange={handleFileChange} />
        <IconButton onClick={openUploader} style={{color:'blue'}}>
            <CloudUploadRoundedIcon></CloudUploadRoundedIcon>
        </IconButton>
        <IconButton onClick={resumeUpload} ref={resumeButtonRef} style={{color:'red'}}>
            <PlayArrowRoundedIcon></PlayArrowRoundedIcon>
        </IconButton>
        <IconButton onClick={stopUpload} ref={pauseButtonRef} style={{color:'green'}}>
            <PauseCircleFilledRoundedIcon></PauseCircleFilledRoundedIcon >
        </IconButton>
    </Container>
  );
}


