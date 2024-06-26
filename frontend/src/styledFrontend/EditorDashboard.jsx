import  { useEffect, useRef, useState } from 'react';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import axios from 'axios';
import {Button,Dialog,DialogTitle,DialogContent,TextField,Card,CardContent,DialogActions,List,ListItem, ButtonGroup, Snackbar, Alert, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CardHeader, CardMedia, ListItemIcon, ListItemText, Container, Icon, Tooltip, Divider} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { BACKEND_URL , FRONTEND_URL, SERVE_URL,YOUTUBE_URL,TUS_URL } from '../config';
const send=axios.create({
  withCredentials:true 

})
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import UploadIcon from '@mui/icons-material/Upload';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

function TaskManagerAndCreateBundle({User,orders }) {
  const [editorRegisteredState,setEditorRegisteredState]=useState(User.registeredAsEditor); 
  const [currentTask, setCurrentTask] = useState(null);
  const [ycode,setYcode]=useState(0);
  const [snackBar,setSnackBar]=useState(null)
  useEffect(()=>{
      send.get(BACKEND_URL + '/createbundle').then((res)=>{
    
          setYcode(res.data);        
      })
  },[currentTask]);

  const handleUploadClick = (task) => {
    
    setCurrentTask(task);
  };

  const handleBackToNormalView = () => {
  
    setCurrentTask(null);
  };
  function handleFinish(){
    send.get(BACKEND_URL + '/finishbundle',{params:{code:ycode,
  id:currentTask.ownerid}}).then((res)=>{
    console.log(res.data);
    window.location.href=FRONTEND_URL + '/editor';
  })
  }
  function handleDownloadVideo(orderId) {
    window.location.href=`${SERVE_URL}/download?id=${orderId}`;
    console.log(`Downloading video for Order ${orderId}`);
  }
  const handleRowHover = (index) => {
    const buttons = document.getElementsByClassName(`row-buttons-${index}`);
    for (const button of buttons) {
      button.style.display = 'block';
    }
  };
  
 
  
function handleDownloadResources(orderId) {
  window.location.href=`${SERVE_URL}/download-zip?id=${orderId}`
  console.log(`Downloading resources for Order ${orderId}`);
}
  if(editorRegisteredState==false){
    return(
      <EditorRegister User={User} setState={setEditorRegisteredState}></EditorRegister>
    )
  }
  else{

    if(orders==null||orders.length==0){
     
      return(
        <Snackbar
        open={true}
        autoHideDuration={null} // Set to `null` to make it not automatically close
        onClose={()=>{}}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          severity="info"
         
        >
          No Order to be Completed or Reviewed
        </Alert>
      </Snackbar>

      )
    }
    else{
    return (
      <div>
        
        {currentTask === null ? (
       
                <div style={{marginTop:'5%',marginLeft:'1vw',marginRight:'1vw'}}>
                 
                <Grid container spacing={6}>
                 
                     {orders?.map((task,index)=>{
                         var bool=false;
                         for(let i=0;i<User.videoOrdersUploaded.length;i++){
                          
                          if(User.videoOrdersUploaded[i].taskid==task.order.id){
                            bool=true;
                          }
                         }
                        
                         
                         return (
                             
                             <Grid item xs={4} key={index} >
                                 <Card elevation={1} style={{padding:'2vw'}}>
                                     <CardHeader
                                     //will fix this
                                     avatar={
                                     bool&&(
                                     <Tooltip arrow title={'Already Uploaded!'}>
                                        <CheckCircleIcon style={{color:'green'}}></CheckCircleIcon>
                                     </Tooltip>
                                     )
                                     }
                                     action={
                                      
                                      <ButtonGroup>
                                        {bool?<Tooltip arrow title={'Upload Disabled'}>
                                           <IconButton disabled={bool} onClick={()=>{
                                            if(bool==false){
                                            handleUploadClick(task)
                                            }
                                        }} 
                                        style={{color:'black'}}>
                                            <UploadIcon></UploadIcon>
                                        </IconButton>
                                        </Tooltip>:<Tooltip arrow title={'Upload'}>
                                           <IconButton onClick={()=>{
                                           
                                            handleUploadClick(task)
                                            
                                        }} 
                                        style={{color:'red'}}>
                                            <UploadIcon></UploadIcon>
                                        </IconButton>
                                        </Tooltip>}
                                        <Tooltip arrow title={"Download Video"}>
                                     
                                        <IconButton onClick={()=>{
                                           handleDownloadVideo(task.order.orignalVideo.fileName)
                                        }}
                                        style={{color:'orange'}}>
                                          <WebAssetIcon></WebAssetIcon>
                                        </IconButton>
                                        </Tooltip>
                                        <Tooltip arrow title={"Download resource zip file"}>
                                        <IconButton onClick={()=>{
                                          handleDownloadResources(task.order.id)
                                        }} style={{color:'blue'}}>
                                            <Download></Download>
                                        </IconButton>
                                        </Tooltip>
                                       
                                      </ButtonGroup>
                                       
                                     }
                                     
                                    title={`This Task is Assigned by ${task.ownerid}`}
                                     />
                                     <CardMedia
                                         
                                         component="video"
                                         controls // Add this attribute to display video controls (play, pause, volume, etc.)
                                         src={`${SERVE_URL}/stream?id=${task.order.orignalVideo.fileName}`}
                                         title="Your Video Title"
                                     />
                                     <CardContent>
                                         Click on the three dot
                                     </CardContent>
                                 </Card>
                             </Grid>
                         )
                     })}
                     </Grid>
            
          </div>
        ) : (
          
         
          <div style={{marginTop:'15%',marginLeft:'25%'}}>
          <Grid container spacing={4}>
           <Grid item xs={12} md={6} lg={4}>
           <Card elevation={1}>
               <CardHeader               
                 title={ 'Upload Video'}
                 subheader={ 'Upload your Video'}
               />
               <CardContent>
                   <Upload User={User} code={currentTask.order.id} role={'editedVideo'} bundlereciever={currentTask.ownerid} ycode={ycode}/>
               </CardContent>
             </Card>
           </Grid>
           <Grid item xs={12} md={6} lg={4}>
           <Card elevation={1} >
               <CardHeader
                 
                 
                 title={ 'Upload Thumbanail'}
                 subheader={ 'Upload your Thumbnail Here'}
               />
               <CardContent>
                   <Upload User={User} code={currentTask.order.id} role={'editedThumbnail'} bundlereciever={currentTask.ownerid} ycode={ycode}/>
               </CardContent>
             </Card>
           </Grid>
           <Grid item xs={12}>
              
                
             
                
             <IconButton onClick={handleFinish} style={{position:'absolute',bottom:'10vh',right:'5vw'}} >
               <AddCircleIcon style={{fontSize:'100px'}}></AddCircleIcon>
             </IconButton>
           </Grid>
         
          
             </Grid>  
             </div>
        )}
      </div>
    );
        }
  }

  
}


function EditorRegister({User}){
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    skills:'',
    qualification:'',
    rates:'',
    level:'',
    descriptionRate:'',
  });
  const [skillsList, setSkillsList] = useState([]);
  const [qualificationList,setQualificationList]=useState([]);
  const [rateList,setRateList]=useState([]);
  const handleClose = () => {
    setOpen(true);
  };

  const handleInputChange = (e) => {
    
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && formData.skills.trim() !== '') {
      setSkillsList((prevSkillsList) => [...prevSkillsList, formData.skills]);
      setFormData({ ...formData, skills: '' });
    }
  };
  const handleAddRate = (e) => {
    if (e.key === 'Enter' && formData.rates.trim() !== '') {
      setRateList((prevSkillsList) => [...prevSkillsList, {rate:formData.rates,level:formData.level,description:formData.descriptionRate}]);
      setFormData({ ...formData, rates: '',descriptionRate:'',level:''});
    }
  };
  function handleSkillDelete(id){
    setSkillsList(skillsList.filter((skill,index)=>{
      return id!=index;
    }))
  }
  function handleQualificationDelete(id){
    setQualificationList(qualificationList.filter((skill,index)=>{
      return id!=index;
    }))
  }
  function handleRateDelete(id){
    setRateList(rateList.filter((skill,index)=>{
      return id!=index;
    }))
  }
  const handleAddQualification = (e) => {
    if (e.key === 'Enter' && formData.qualification.trim() !== '') {
      setQualificationList((prevSkillsList) => [...prevSkillsList, formData.qualification]);
      setFormData({ ...formData, qualification: '' });
    }
  };

  const handleFormSubmit = () => {
    // Handle form submission here, e.g., send data to the server.
    console.log('Skills List:', skillsList);
    console.log('Description Editor',formData.description)
    console.log('Rates',rateList)
    console.log('Qualification',qualificationList)
    axios.get(BACKEND_URL + '/registerEditor',{
      params:{
        skills:skillsList,
        descriptionEditor:formData.description,
        rates:rateList,
        qualification:qualificationList,
        googleId:User.googleId,
      }
    })
    // Close the dialog
    setOpen(false);
  };

  return (
    <div>
        <Snackbar
          key={0}
          open={open}
          autoHideDuration={6000}
          onClose={()=>{}}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={'info'}>
            {"This Info will be Displayed to Creator's along with your profile data"}
          </Alert>
        </Snackbar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>👾Register As Editor👾</DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
            <TextField
                autoFocus
                margin="dense"
                name="description"
                label="Description of Yourself"
                type="text"
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
               
              />
      
            
            <ButtonGroup style={{flexWrap:'wrap'}}>
                {rateList?.map((skill, index) => (
                 <CapsuleIconButton  key={index} icon={<CancelIcon></CancelIcon>}  text={`${skill.level}:${skill.description}-${skill.rate}`} onClick={()=>{handleRateDelete(index)}}></CapsuleIconButton>//put capsule button's instead of icon
                ))}
             </ButtonGroup>
                <Grid container style={{margin:'0'}}>
                  <Grid item xs={11}>
                  <TextField
                autoFocus
                margin="dense"
                name="level"
                label="What is the Level of Work"
                type="text"
                fullWidth
                value={formData.level}
                onChange={handleInputChange}
                onKeyDown={handleAddRate}
                
              />
                  </Grid>
                  <Grid item xs={1}>
                    <Tooltip arrow title={'This is the Work Section Tell what you do here'} >
                
                      <HelpRoundedIcon style={{color:'gold' ,marginTop:'50%',marginLeft:'30%'}}></HelpRoundedIcon>
                    
                    </Tooltip>
                  </Grid>
                </Grid>
              
             
               <TextField
                autoFocus
                margin="dense"
                name="descriptionRate"
                label="what would you do in this level"
                type="text"
                fullWidth
                value={formData.descriptionRate}
                onChange={handleInputChange}
                onKeyDown={handleAddRate}
              />
               <TextField
                autoFocus
                margin="dense"
                name="rates"
                label="how much would you charge for this level of work"
                type="text"
                fullWidth
                value={formData.rates}
                onChange={handleInputChange}
                onKeyDown={handleAddRate}
              />
             <Divider></Divider>
              <ButtonGroup style={{flexWrap:'wrap'}}>
                {qualificationList?.map((skill, index) => (
                  <CapsuleIconButton key={index} icon={<CancelIcon></CancelIcon>}  text={skill} onClick={()=>{handleQualificationDelete(index)}}></CapsuleIconButton>//put capsule button's instead of icon
                ))}
             </ButtonGroup>
         
               
               <TextField
                autoFocus
                margin="dense"
                name="qualification"
                label="Qualification"
                type="text"
                fullWidth
                value={formData.qualification}
                onChange={handleInputChange}
                onKeyDown={handleAddQualification}
              />
             <ButtonGroup style={{flexWrap:'wrap'}}>
                {skillsList?.map((skill, index) => (
                   <CapsuleIconButton  key={index} icon={<CancelIcon></CancelIcon>}  text={skill} onClick={()=>{handleSkillDelete(index)}}></CapsuleIconButton> //put capsule button's instead of icon
                ))}
           </ButtonGroup>
               <TextField
                autoFocus
                margin="dense"
                name="skills"
                label="Skills"
                type="text"
                fullWidth
                value={formData.skills}
                onChange={handleInputChange}
                onKeyDown={handleAddSkill}
              />
             
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
         
          {/* <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button> */}
          <IconButton onClick={handleFormSubmit} style={{color:'greenyellow'}}>
              <SendRoundedIcon style={{height:'50px',width:'50px'}}></SendRoundedIcon>
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}


import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { AddAPhotoOutlined, Download, PreviewOutlined } from '@mui/icons-material';
import YouTube from '@mui/icons-material/YouTube';
import { useTheme } from '@emotion/react';

 function CapsuleIconButton({ icon, text, onClick }) {
  const capsuleButtonStyle = {
    border:'2px solid black',
    borderRadius: '999px', // Makes the button shape like a capsule
    padding: '8px 16px', // Adjust padding as needed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin:'2px'
  };

  const typographyStyle = {
    marginLeft: '8px',
  };

  return (
    <IconButton style={capsuleButtonStyle} onClick={onClick}>
      {icon}
      <Typography variant="body1" style={typographyStyle}>
        {text}
      </Typography>
    </IconButton>
  );
}
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUpload';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import * as tus from 'tus-js-client';
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
          endpoint: TUS_URL + "http://localhost:1080/storage/",
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
      <IconButton onClick={openUploader}>
          <CloudUploadRoundedIcon></CloudUploadRoundedIcon>
      </IconButton>
      <IconButton onClick={resumeUpload} ref={resumeButtonRef}>
          <PlayArrowRoundedIcon></PlayArrowRoundedIcon>
      </IconButton>
      <IconButton onClick={stopUpload} ref={pauseButtonRef}>
          <PauseCircleFilledRoundedIcon></PauseCircleFilledRoundedIcon>
      </IconButton>
  </Container>
);
}


export default TaskManagerAndCreateBundle;
