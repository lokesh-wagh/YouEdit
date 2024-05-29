/*
  1. use ToolTip on all the icon's so the user know's the UI well
  remaining 
    Finalize view
    Editor Preview
    Editor Orders
    
*/

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './Scrollbar.css'
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AddCircleOutlineOutlined, AddShoppingCart, SubjectOutlined } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Auth from './Auth';
import PreviousTask from './PreviousTask';
import CreatorDashboard from '../CreatorDashboard';
import LandingPage from './LandingPage';
import CreateTask from './CreateTask';
import TaskManagerAndCreateBundle from './EditorDashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EmergencyRecordingRoundedIcon from '@mui/icons-material/EmergencyRecordingRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Alert, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Icon, IconButton, Snackbar, TextField, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';

import { FRONTEND_URL , BACKEND_URL , SERVE_URL , YOUTUBE_URL , TUS_URL } from '../config';

const send = axios.create({
  withCredentials: true, // this ensures that axios is sending cookies along with the request
});

const backgroundColor = '#F6F8FC'

function App() {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [profileOpen,setProfileOpen]=useState(false);


  useEffect(() => {
    send.get(BACKEND_URL + '/auth/status')
      .then((response) => {
        setAuthenticated(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    if (authenticated === false) {
      setUser(null); // if not authenticated, set user as false
    }
    if (authenticated === true) {
      send.get(BACKEND_URL + '/user')
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [authenticated]);
  function handleLogout(){
      send.get(BACKEND_URL + '/logout').then(()=>{
        setAuthenticated(false);
        setUser(null);
      }).catch((err)=>{
        console.log(err);
      })
  }
  if (user === null) {
    send.get( BACKEND_URL + '/user')
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  if (authenticated === null) {
    return (
      <div>
        LOADER MOST PROBABLY BACKEND IS DOWN
      </div>
    );
  }

  return authenticated === true ? (
    <>
      {/* here we will have the navbar and a side bar and buttons to call the routes shown below */}
     
      <Layout handleLogout={handleLogout} user={user} setProfileOpen={setProfileOpen}>
          <Dialog onClose={()=>{
            setProfileOpen(false);
          }}
          open={profileOpen}
          maxWidth="xs"
          fullWidth
          >
            <DialogContent>
              <ProfileToast user={user} handleLogout={handleLogout} setProfileOpen={setProfileOpen} setUser={setUser}>

              </ProfileToast>
            </DialogContent>
          </Dialog>
        <Routes>
       
            <Route path='/' element={<LandingPage />} />
      
              <Route path='/creator' element={<CreatorDashboard user={user} />} />
              <Route path='/creator/create-task' element={<CreateTask User={user || { googleId: '11231231' }} />} />
              <Route path='/creator/previous-tasks/*' element={<PreviousTask User={user || { googleId: '11231231' }} tasks={(user && user.tasks) || {}} setUser={setUser}/>} />
              <Route path='/editor' element={<TaskManagerAndCreateBundle User={user || { googleId: '11231231' }} orders={(user && user.videoOrdersAssigned) || {}} />} />
            
          </Routes>
          </Layout>
      
    </>
  ) : (
    <Layout>
       <Auth />
    </Layout>
   
  );
}

const drawerWidth = 300;
const appbarHeight=7;
const menuItems = [
  {
    text: 'See Previous Editing',
    icon: <SubjectOutlined color="secondary" />,
    path: '/creator/previous-tasks/'
  },
  {
    text: 'Get a Video Edited',
    icon: <AddShoppingCart color="secondary" />,
    path: '/creator/create-task'
  },
  {
    text:'See Your Editing Orders',
    icon:<AddCircleOutlineOutlined color="secondary" />,
    path:'/editor'
  }
  
]


function Layout({ children,handleLogout,user,setProfileOpen}) {
  const [selectedItem,setSelectedItem]=useState(null);

  const history = useNavigate();
  const location = useLocation();
 
  

  

  return (
    
    <div style={{ display: 'flex',background:backgroundColor}}>
      
      <AppBar
        position="fixed"
        style={{ width: 'calc(100% - ' + drawerWidth + 'px)', marginLeft: drawerWidth,background:backgroundColor}}
        elevation={0}
     
      >
        <Toolbar style={{height:appbarHeight+'vh',display:'flex',flexDirection:'row-reverse'}}>
         
          
          <IconButton onClick={()=>{
            setProfileOpen(true);
          }}>
              <Avatar src={user&&user.profileURL} style={{height:'6vh',width:'6vh'}}></Avatar>
          </IconButton>
          
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <Drawer
        
        style={{ width: drawerWidth }}
        variant="permanent"
        
        PaperProps={{sx:{
          width:drawerWidth,
          border:'none',  
          backgroundColor:backgroundColor
        }}}
        anchor="left"
      >
        <div>
          <Typography variant="h5" style={{ padding: '2rem' }}>
          🎥YOUEDIT🎥
          </Typography>
        </div>

        {/* links/list section */}
        <List>
          {menuItems.map((item,index) => (
            <ListItem
            
              button
              key={item.text}
              onClick={() => {
                setSelectedItem(index);
                history(item.path)}}
              sx={{
                backgroundColor: selectedItem === index ? '#D3E3FD' : 'transparent', // Change background color for selected item
                borderRadius:'10px',
                width:'80%',
                
                marginLeft:'10%',
                marginTop:"2%",
                marginBottom:'2%',  
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text}/>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* main content */}
      <div className='guySittingonPage' style={{ background: '#ffffff', width: '80%', marginTop: appbarHeight+2+'vh',height:100-appbarHeight-6+'vh',borderRadius:'1vh',overflowY:'auto', scrollBehavior:'smooth',scrollbarWidth:'thin'}}>
        <div className='canvasGuy' style={{ height: `calc(100%-${appbarHeight}vh`,width:'100%' }}>
          {children}
        </div>
      </div>
    </div>
   
  );
}

function ProfileToast({user,handleLogout,setProfileOpen,setUser}){
  const [editOpen,setEditOpen]=useState(false);  
  return(
           <>
           
                  <Dialog
                    open={editOpen}
                    onClose={()=>{
                      setEditOpen(false);
                      
                    }}
                    fullWidth
                    maxWidth='xs'
                  >
                    <DialogContent>
                        <EditorRegister User={user} setUser={setUser}></EditorRegister>
                    </DialogContent>
                  </Dialog>
              
                   <Card style={{padding:'1%'}}>
                          
                        <CardHeader
                        avatar={
                          <IconButton onClick={()=>{
                            setProfileOpen(false);
                          }}
                          style={{color:'black'}}
                          >
                            <ArrowBackIcon></ArrowBackIcon>
                          </IconButton>
                        }
                        action={
                        <>
                        
                        <Tooltip title="logout??" arrow>
                             <IconButton onClick={()=>{
                          handleLogout();
                        }}
                        style={{color:'red'}}>
                          <LogoutIcon></LogoutIcon>
                        </IconButton>
                        </Tooltip>
                        <IconButton onClick={()=>{
                          setEditOpen(true);
                        }}
                        style={{color:'blue'}}>
                          <EditRoundedIcon>

                          </EditRoundedIcon>
                        </IconButton>
                        </>
                       }/>
                        <Avatar src={user.profileURL} style={{height:'100px',width:'100px',margin:'3vh auto',border:'4px solid lime'}}>

                        </Avatar>
                        <Divider></Divider>
                      
                          <CardContent>
                            <Grid container >
                              <Grid item xs={5}></Grid>
                              <Grid item >
                              <StarIcon style={{color:'gold'}}>

                              </StarIcon> 
                              </Grid>
                              <Grid item >
                                  {user?.editorProfile?.rating}.0
                              </Grid>
                            </Grid>
                           
                          
                           
                             
                              <Container  style={{marginTop:'2vh',marginBottom:'2vh', textAlign:'center'}} >
                                <Typography>{user.username}</Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                {user?.editorProfile?.description}
                                </Typography>
                              </Container>
                             
                              
                              <ButtonGroup style={{marginTop:'2vh',marginBottom:'2vh'}}>
                              
                              
                              {user?.editorProfile?.skills.map((skill,index)=>{
                                      return(
                                          <CapsuleIconButton
                                          key={index}
                                          text={skill}
                                          ></CapsuleIconButton>
                                      )
                                  })}
                              </ButtonGroup>
                                  
                      
                              
                              <ButtonGroup style={{marginTop:'2vh',marginBottom:'2vh'}}>
                              

                              {
                              user?.editorProfile?.qualifications.map((skill,index)=>{
                                      return(
                                          <CapsuleIconButton
                                          key={index}
                                          text={skill}
                                          ></CapsuleIconButton>
                                      )
                                  })
                              }         
                              </ButtonGroup>

                              
                              <ButtonGroup style={{marginTop:'3vh',marginBottom:'1vh'}}>


                              </ButtonGroup>


                      
                          </CardContent>
                      </Card>    
                
                </>
    )
}

function EditorRegister({User,setUser}){
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    description: User.editorProfile.description,
    skills:'',
    qualification:'',
    rates:'',
    level:'',
    descriptionRate:'',
  });
  const [skillsList, setSkillsList] = useState(User.editorProfile.skills);
  const [qualificationList,setQualificationList]=useState(User.editorProfile.qualifications);
  const [rateList,setRateList]=useState([]);
  console.log(User);
  const handleClose = () => {
    setOpen(false);
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
    setUser({...User,editorProfile:{skills:skillsList,
      description:formData.description,
      rates:rateList,
      qualifications:qualificationList}});
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
        <DialogTitle>Edit Profile</DialogTitle>
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

function CapsuleIconButton({ text,onClick}) {
  const capsuleButtonStyle = { 
    
    borderRadius: '999px', // Makes the button shape like a capsule
    padding: '7px 14px', // Adjust padding as needed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin:'2px',
    height:'8%',
    backgroundColor:backgroundColor,
    border:'2px solid gold',
  };

  const typographyStyle = {
    marginLeft: '8px',
    fontSize:'14px'
  };

  return (
    <IconButton style={capsuleButtonStyle} onClick={(e)=>{
      if(onClick!=null){
          onClick(e);
      }
    }}>
     
      <Typography variant="body1" style={typographyStyle}>
        {text}
      </Typography>
    </IconButton>
  );
}
  

export default App;
