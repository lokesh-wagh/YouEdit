import { useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import './Scrollbar.css'
import { AddAPhotoOutlined, DeleteOutline, ImportContacts, TableView } from '@mui/icons-material';
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

import { Card,CardContent, CardHeader, CardMedia, Grid, IconButton, ListItemIcon, ListItemText } from '@mui/material';

export default function TaskManager({ tasks, User }) {
  const [currentTask, setCurrentTask] = useState(null);//temporary fix
  const [currentThing, setCurrentThing] = useState(null);
  
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
       
            <PictureAsPdfIcon>

            </PictureAsPdfIcon>
          
        )
        case "image":
          return (
            <InsertPhotoIcon></InsertPhotoIcon>
          )
        case "video":
          return (<SlideshowIcon></SlideshowIcon>)
        default :
        return (<AddAPhotoOutlined></AddAPhotoOutlined>)
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
            <Grid item xs={5} >
            <Card elevation={1} style={{maxHeight:"80vh",overflowY:"auto"}} className='previewCard'>
            <CardHeader
              action={<DropdownMenu2 task={currentTask} handleDownloadResources={handleDownloadResources} handleDownloadVideo={handleDownloadVideo}></DropdownMenu2>}
              title={'Previewing a Video'}
              subheader={'video id is '+currentTask.id}
              avatar={<IconButton onClick={handleBackClick}>
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
                            <IconButton onClick={() => handleDeleteResource(resource.media.fileName, User.googleId, currentTask.id)}>
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
          
          <Hire User={User} task={currentTask} />
        </div>
      );
      break;
    case 'finalize':
        content=(
          <div>
         
             <button onClick={handleBackClick}>Back to Previous Tasks</button>
             <Finalize User={User} task={currentTask}></Finalize>
          </div>
        )
    break;
    default:
      content = (
        <div style={{marginTop:'5%',marginLeft:'1vw',marginRight:'1vw'}}>
           <Grid container spacing={6}>
            
                {tasks.slice(0,3).map((task,index)=>{
                    return (
                        
                        <Grid item xs={4} key={index} >
                            <Card elevation={1} style={{padding:'2vw'}}>
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
                                            <IconButton onClick={() => handleTaskClick(task,'edit')}>
                                                <PreviewIcon></PreviewIcon>
                                            </IconButton>
                                            <IconButton onClick={() => handleTaskClick(task,'hire')}>
                                                <AddAPhotoOutlined></AddAPhotoOutlined>
                                            </IconButton>
                                            <IconButton onClick={()=> handleTaskClick(task,'finalize')}>
                                                <YouTubeIcon></YouTubeIcon>
                                            </IconButton>
                                            <IconButton onClick={()=>{handleDownloadResources(task)}}>
                                                <DownloadIcon></DownloadIcon>
                                            </IconButton>
                                            <IconButton onClick={()=>{handleDownloadVideo(task)}}>
                                                <WebAssetIcon></WebAssetIcon>
                                            </IconButton>
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
                <IconButton onClick={()=>{handleTaskClick(task,'finalize')}}>
                        <YouTubeIcon>
                          
                        </YouTubeIcon>
                </IconButton>
           </ListItemIcon>
           <ListItemText onClick={()=>{handleTaskClick(task,'finalize')}}>
                 Upload
           </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose} >
            <ListItemIcon>
                <IconButton onClick={()=>{handleTaskClick(task,'hire')}}>
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
                <IconButton onClick={()=>{handleDownloadResources(task)}}>
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