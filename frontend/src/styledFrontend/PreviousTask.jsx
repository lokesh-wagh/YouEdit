import { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import './Scrollbar.css'
import { AddAPhotoOutlined, BackHand } from '@mui/icons-material';
import Finalize from './Finalize';
import Hire from './Hire';
import DownloadIcon from '@mui/icons-material/Download';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import PreviewIcon from '@mui/icons-material/Preview';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import {  Alert, Card,CardContent, CardHeader, CardMedia, Grid, IconButton, ListItemIcon, ListItemText, Snackbar, Tooltip,  } from '@mui/material';

const send = axios.create({
  withCredentials: true, // this ensures that axios is sending cookies along with the request
});

export default function TaskManager({ tasks, User ,setUser}) {
  const [currentTask, setCurrentTask] = useState(null);//temporary fix
  const [currentThing, setCurrentThing] = useState(null);
  
  useEffect(()=>{
    send.get('http://localhost:8000/user').then((res)=>{
      setUser(res.data);
    }).catch((err)=>{
      console.log(err)
    })
  },[])
  function formatISODate(isoDateString) {
    const date = new Date(isoDateString);
  
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      
    };
  
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const handleTaskClick = (task,thing) => {
    setCurrentTask(task);
    setCurrentThing(thing);
  };

  const handleBackClick = () => {
    setCurrentTask(null);
    setCurrentThing(null);
  };

  const handleDownloadVideo = (task) => {
    window.location.href = `http://localhost:3000/download?id=${task.orignalVideo.fileName}`;
    console.log('Download video');
  };

  const handleDownloadResources = (task) => {
    window.location.href = `http://localhost:3000/download-zip?id=${task.id}`;
    console.log('Download resources');
  };

  const handleDeleteResource = (id, userid, taskid) => {
    axios
      .get(`http://localhost:3000/delete?fileid=${id}&userid=${userid}&taskid=${taskid}`)
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          if (currentTask) {
            const updatedResources = currentTask.resources.filter(
              (resource) => resource.media.fileName !== id
            );
            setCurrentTask({
              ...currentTask,
              resources: updatedResources,
            });
            console.log(`Resource with ID ${id} deleted successfully.`);
          }
        }
      })
      .catch((error) => {
        console.error(`Error deleting resource: ${error}`);
      });
  };
  const handleRowHover = (index) => {
    const buttons = document.getElementsByClassName(`row-buttons-${index}`);
    for (const button of buttons) {
      button.style.display = 'block';
    }
  };
  function properIconSelector(type){
    switch(type){
      case "application":
        return(
       
            <PictureAsPdfIcon style={{color:'red'}}>

            </PictureAsPdfIcon>
          
        )
        case "image":
          return (
            <InsertPhotoIcon style={{color:'gold'}}></InsertPhotoIcon>
          )
        case "video":
          return (<SlideshowIcon style={{color:'blue'}}></SlideshowIcon>)
        default :
        return (<AddAPhotoOutlined style={{color:'orange'}}></AddAPhotoOutlined>)
    }
  }
  
  const handleRowMouseLeave = (index) => {
    const buttons = document.getElementsByClassName(`row-buttons-${index}`);
    for (const button of buttons) {
      button.style.display = 'none';
    }
  };

  let content;
  switch (currentThing) {
    case 'edit':
      content = (
      
          <Grid container style={{paddingTop:'2%' ,maxHeight:"40%"}}>
            <Grid item xs={3.5}></Grid>
            <Grid item xs={5} style={{border:'4px solid gold'}} >
            <Card elevation={1} style={{maxHeight:"80vh",overflowY:"auto",}} className='previewCard'>
            <CardHeader
              action={<DropdownMenu2 task={currentTask} handleDownloadResources={handleDownloadResources} handleDownloadVideo={handleDownloadVideo}></DropdownMenu2>}
              title={'Previewing a Video'}
              subheader={'video id is '+currentTask.id}
              avatar={<IconButton onClick={handleBackClick} style={{color:'black'}}>
                <ArrowBackIcon></ArrowBackIcon>
              </IconButton>}
            >

            </CardHeader>
            <CardMedia
                                    
              component="video"
              controls // Add this attribute to display video controls (play, pause, volume, etc.)
              src={`http://localhost:3000/stream?id=${currentTask.orignalVideo.fileName}`}
              title="Your Video Title"
            />
            <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          type
                        </TableCell>
                        <TableCell>
                          resource id
                        </TableCell>
                        <TableCell>
                          action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  <TableBody>
                    {
                    currentTask!=null?
                      currentTask.resources.map((resource,index)=>{
                        return(
                        <TableRow key={index}>
                          <TableCell>
                            <IconButton>
                            {
                             properIconSelector(resource.media.mimeType.split('/')[0])
                            }
                            </IconButton>
                            
                          </TableCell>
                          <TableCell>
                              {resource.media.fileName}
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleDeleteResource(resource.media.fileName, User.googleId, currentTask.id)} style={{color:'blue'}}>
                              <DeleteIcon></DeleteIcon>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )}):<></>
                          }
                      
                    
                  
                   
                  </TableBody>

                  </Table>
                </TableContainer>
            </CardContent>
          </Card>
            </Grid>
          </Grid>
          
        
        
      );
      break;
    case 'hire':
      content = (
        <div>
          
          <IconButton onClick={()=>{handleBackClick()}} style={{color:'black'}}>
              <ArrowBackIcon></ArrowBackIcon>
             </IconButton>
          <Hire User={User} task={currentTask} />
        </div>
      );
      break;
    case 'finalize':
        content=(
          <div>
         
             <IconButton onClick={()=>{handleBackClick()}} style={{color:'black'}}>
              <ArrowBackIcon></ArrowBackIcon>
             </IconButton>
             <Finalize User={User} task={currentTask}></Finalize>
          </div>
        )
    break;
    default:
      content = (

        <div style={{marginTop:'5%',marginLeft:'1vw',marginRight:'1vw'}}>
           {tasks==null&&<Snackbar
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
            No Previous Task Uploaded
          </Alert>
        </Snackbar>
  }
           <Grid container spacing={6}>
            
                {tasks.slice(0,3).map((task,index)=>{
                    return (
                        
                        <Grid item xs={4} key={index} >
                            <Card elevation={1} style={{padding:'2vw',border:'2px solid gold'}}>
                                <CardHeader
                                
                                action={<DropdownMenu task={task} handleTaskClick={handleTaskClick}>

                                </DropdownMenu>}
                                title={'Suggested video tasks'}
                                subheader={'task id is '+task.id}
                                />
                                <CardMedia
                                    
                                    component="video"
                                    controls // Add this attribute to display video controls (play, pause, volume, etc.)
                                    src={`http://localhost:3000/stream?id=${task.orignalVideo.fileName}`}
                                    title="Your Video Title"
                                />
                                <CardContent>
                                    Click on the three dot
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
           
            
                
                <Grid item xs={12}>
                       <TableContainer>
                 <Table>
                 <TableHead>
                    <TableRow>
                        <TableCell>Name/id</TableCell>
                      
                        <TableCell>CreationDate</TableCell>
                        <TableCell>Number of Resources</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                 </TableHead>
                 <TableBody>
                    {
                        tasks.map((task,index)=>{
                          console.log(task)
                            return (
                                <TableRow
                                style={{height:'10vh'}}
                                  key={task.id}
                                  
                                  onMouseEnter={() => handleRowHover(index)}
                                  onMouseLeave={() => handleRowMouseLeave(index)}
                                >
                                    <TableCell style={{width:'2vw',alignItems:'left'}}>{task.id}</TableCell>
                                   
                                    <TableCell style={{width:'2vw',alignItems:'left'}}>{formatISODate(task.orignalVideo.creationDate)}</TableCell>
                                    <TableCell style={{width:'2vw',alignItems:'left'}}>{task.resources.length}</TableCell>
                                  
                                    <TableCell style={{width:'5vw',alignItems:'left'}}>
                                    <div className={`row-buttons-${index}`} style={{ display: 'none' }}>
                                
                                            <Tooltip arrow title={"Preview"}>
                                              <IconButton onClick={() => handleTaskClick(task,'edit')} style={{color:'blue'}}>
                                                  <PreviewIcon></PreviewIcon>
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip arrow title={"Hire Editor"}>
                                              <IconButton onClick={() => handleTaskClick(task,'hire') } style={{color:'orange'}}>
                                                  <AddAPhotoOutlined></AddAPhotoOutlined>
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip arrow title={"See Upload's By Editor's"}>
                                            <IconButton onClick={()=> handleTaskClick(task,'finalize')} style={{color:'red'}}>
                                                <YouTubeIcon></YouTubeIcon>
                                            </IconButton>
                                            </Tooltip>
                                            <Tooltip arrow title={"Download Resources"}>
                                            <IconButton onClick={()=>{handleDownloadResources(task)}} style={{color:'green'}}>
                                                <DownloadIcon></DownloadIcon>
                                            </IconButton>
                                            </Tooltip>
                                            <Tooltip arrow title={"Download Video"}>
                                              
                                            <IconButton onClick={()=>{handleDownloadVideo(task)}} style={{color:'gold'}}>
                                                <WebAssetIcon></WebAssetIcon>
                                            </IconButton>
                                            </Tooltip>
                                            
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                 </TableBody>
                    
                </Table>
            </TableContainer>
                </Grid>
            </Grid> 
        
 
         
          
        </div>
      );
  }

  return <div>{content}</div>;
}

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styled from '@emotion/styled';

function DropdownMenu({task,handleTaskClick}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{color:'black'}}
      >
       <MoreVertIcon></MoreVertIcon>
      </IconButton>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
           <ListItemIcon>
                <IconButton onClick={()=>{handleTaskClick(task,'finalize')}} style={{color:'red'}}>
                        <YouTubeIcon>
                          
                        </YouTubeIcon>
                </IconButton>
           </ListItemIcon>
           <ListItemText onClick={()=>{handleTaskClick(task,'finalize')}} >
                 Upload
           </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose} >
            <ListItemIcon>
                <IconButton onClick={()=>{handleTaskClick(task,'hire')}} style={{color:'orange'}}>
                    <AddAPhotoOutlined>
                        
                    </AddAPhotoOutlined>
                </IconButton>
            </ListItemIcon>
           <ListItemText onClick={()=>{handleTaskClick(task,'hire')}}>
               Hire Editor 
           </ListItemText>
            
           
        </MenuItem>
        
      </Menu>
    </div>
  );
}

function DropdownMenu2({task,handleDownloadVideo,handleDownloadResources}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{color:'black'}}
      >
       <MoreVertIcon></MoreVertIcon>
      </IconButton>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
           <ListItemIcon>
                <IconButton onClick={()=>{handleDownloadResources(task)}} style={{color:'green'}}>
                        <DownloadIcon>

                        </DownloadIcon>
                </IconButton>
           </ListItemIcon>
           <ListItemText onClick={()=>{handleDownloadResources(task)}}>
                Download Resources
           </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose} >
            <ListItemIcon>
                <IconButton onClick={()=>{handleDownloadVideo(task)}}>
                   <WebAssetIcon></WebAssetIcon>

                </IconButton>
            </ListItemIcon>
           <ListItemText onClick={()=>{handleDownloadVideo(task)}}>
                Download Video 
           </ListItemText>
            
           
        </MenuItem>
        
      </Menu>
    </div>
  );
}