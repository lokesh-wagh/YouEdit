import  { useEffect, useState } from 'react';
import axios from 'axios';
import {Button,Dialog,DialogTitle,DialogContent,TextField,Card,CardContent,DialogActions,List,ListItem, ButtonGroup, Snackbar, Alert} from '@mui/material'
const send=axios.create({
  withCredentials:true //this ensure's that axio's is sending cookies along with the request

})
import CancelIcon from '@mui/icons-material/Cancel';
import Upload from '../TusUpload'; // Import your upload component
// videoOrdersUploaded should be recieved where in .order contain's all the information
function TaskManagerAndCreateBundle({User,orders }) {
  const [editorRegisteredState,setEditorRegisteredState]=useState(User.registeredAsEditor); 
  const [currentTask, setCurrentTask] = useState(null);
  const [ycode,setYcode]=useState(0);
  useEffect(()=>{
      send.get('http://localhost:8000/createbundle').then((res)=>{
        console.log(res);
          setYcode(res.data);        
      })
  },[currentTask]);
  console.log(User);
  const handleUploadClick = (task) => {
    
    setCurrentTask(task);
  };

  const handleBackToNormalView = () => {
  
    setCurrentTask(null);
  };
  function handleFinish(){
    send.get('http://localhost:8000/finishbundle',{params:{code:ycode,
  id:currentTask.ownerid}}).then((res)=>{
    console.log(res.data);
    window.location.href='http://localhost:5173/editor';
  })
  }
  function handleDownloadVideo(orderId) {
    window.location.href=`http://localhost:3000/download?id=${orderId}`;
    console.log(`Downloading video for Order ${orderId}`);
  }
  
function handleDownloadResources(orderId) {
  window.location.href=`http://localhost:3000/download-zip?id=${orderId}`
  console.log(`Downloading resources for Order ${orderId}`);
}
  if(editorRegisteredState==false){
    return(
      <EditorRegister User={User} setState={setEditorRegisteredState}></EditorRegister>
    )
  }
  else{
    return (
      <div>
        
        {currentTask === null ? (
       
          <div>
            {orders.map((order) => (
              <div key={order.order.id}>
                <h1>This is order view</h1>
                <h2>Order {order.order.id}</h2>
                <video controls width="400">
                  <source src={`http://localhost:3000/stream?id=${order.order.orignalVideo.fileName}`} type={order.order.orignalVideo.mimeType} />
                  Your browser does not support the video tag.
                </video>
                <button onClick={() => handleDownloadVideo(order.order.orignalVideo.fileName)}>Download Video</button>
                <button onClick={() => handleDownloadResources(order.order.id)}>Download Resources</button>
                <button onClick={() => handleUploadClick(order)}>Upload</button>
              </div>
            ))}
          </div>
        ) : (
          
          <div>
            <button onClick={handleBackToNormalView}>Back to Normal View</button>
            <h2>Upload View for Order {currentTask.order.id}</h2>
            {/* Render the UploadComponent with the currentTask */}
            <Upload User={User} code={currentTask.order.id} role={'editedVideo'} bundlereciever={currentTask.ownerid} ycode={ycode}/>
            <Upload User={User} code={currentTask.order.id} role={'editedThumbnail'} bundlereciever={currentTask.ownerid} ycode={ycode}/>
            <button onClick={handleFinish}>finish editing upload</button>
          </div>
        )}
      </div>
    );
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
    axios.get('http://localhost:8000/registerEditor',{
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
        <DialogTitle>Form Dialog</DialogTitle>
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
                {rateList.map((skill, index) => (
                 <CapsuleIconButton  key={index} icon={<CancelIcon></CancelIcon>}  text={`${skill.level}:${skill.description}-${skill.rate}`} onClick={()=>{handleRateDelete(index)}}></CapsuleIconButton>//put capsule button's instead of icon
                ))}
             </ButtonGroup>
             
               <TextField
                autoFocus
                margin="dense"
                name="level"
                label="Level"
                type="text"
                fullWidth
                value={formData.level}
                onChange={handleInputChange}
                onKeyDown={handleAddRate}
              />
               <TextField
                autoFocus
                margin="dense"
                name="descriptionRate"
                label="what would you do"
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
                label="Rates"
                type="text"
                fullWidth
                value={formData.rates}
                onChange={handleInputChange}
                onKeyDown={handleAddRate}
              />
            
              <ButtonGroup style={{flexWrap:'wrap'}}>
                {qualificationList.map((skill, index) => (
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
                {skillsList.map((skill, index) => (
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

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





export default TaskManagerAndCreateBundle;
