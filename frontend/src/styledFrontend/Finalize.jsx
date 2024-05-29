import { Avatar, Card, CardContent, CardHeader, CardMedia, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { FRONTEND_URL , BACKEND_URL , SERVE_URL , YOUTUBE_URL , TUS_URL } from '../config';
export default function Finalize({User,task}){

    console.log(task);
    function handleDownloadVideo(bundle) {
      window.location.href = `${SERVE_URL}/download?id=${bundle.video.fileName}`;
      console.log('Download video');
    }
    function finalize(bundle){
      const param=JSON.stringify(bundle);
      window.location.href=YOUTUBE_URL + '/login?bundle='+param;
    }
    function handleDownloadThumbnail (bundle)  {
      window.location.href = `${SERVE_URL}/download?id=${bundle.thumbnail.fileName}`;
      console.log('Download resources');
    }
      return (
        <div style={{padding:'2%'}}>
         
          <Grid container spacing={3}>
             {task.editedVideo.map((bundle,index)=>{
              return(
                <Grid item key={index} xs={6}>
                  <Card style={{border:'2px solid gold'}}>
                    <CardHeader
                      title={ <Typography>{`Edited By ${bundle.editor.username}`}</Typography>}
                      avatar={<Avatar src={bundle.editor.profileURL} style={{border:'2px solid lime'}}></Avatar>}
                      action={<DropdownMenu bundle={bundle} 
                      handleDownloadThumbnail={handleDownloadThumbnail} 
                      handleDownloadVideo={handleDownloadVideo} 
                      finalize={finalize}></DropdownMenu>}
                    >
                      </CardHeader>
                    <Grid container spacing={3} style={{padding:'1vw'}}>
                      <Grid item xs={6}>
                      <CardMedia 
                        component={'video'}
                        controls
                        src={`${SERVE_URL}/stream?id=${bundle.video.fileName}`}
                        title={`video by editor`}
                        
                        />
                      </Grid>
                      <Grid item xs={6}>
                        
                    <CardMedia
                      
                      component={'img'}
                      src={`${SERVE_URL}/stream?id=${bundle.thumbnail.fileName}`}
                      title={`video thumbnail`}
                      />
                   
                      </Grid>
                    </Grid>
                    
                    
                  
                 


                     
                 
                    
                  </Card>
                </Grid>
                )
             })}
          </Grid>
       
        </div>
      )
  }
  import MoreVertIcon from '@mui/icons-material/MoreVertRounded';
  import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';
  import YouTubeIcon from '@mui/icons-material/YouTube';
  import VideoFileIcon from '@mui/icons-material/VideoFile';
import { useState } from "react";
import { Girl } from "@mui/icons-material";
function DropdownMenu({bundle,handleDownloadThumbnail,handleDownloadVideo,finalize}) {
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
                <IconButton onClick={()=>{finalize(bundle)}} style={{color:'red'}}>
                        <YouTubeIcon>
                          
                        </YouTubeIcon>
                </IconButton>
           </ListItemIcon>
           <ListItemText onClick={()=>{finalize(bundle)}}>
                 Upload to Youtube
           </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose} >
            <ListItemIcon>
                <IconButton onClick={()=>{handleDownloadThumbnail(bundle)}} style={{color:'green'}}>
                    <SimCardDownloadRoundedIcon>

                    </SimCardDownloadRoundedIcon>
                </IconButton>
            </ListItemIcon>
           <ListItemText onClick={()=>{handleDownloadThumbnail(bundle)}}>
               Download Thumbnail
           </ListItemText>
            
           
        </MenuItem>
        <MenuItem onClick={handleClose} >
            <ListItemIcon>
                <IconButton onClick={()=>{handleDownloadVideo(bundle)}} style={{color:'blue'}}>
                    <VideoFileIcon></VideoFileIcon>
                </IconButton>
            </ListItemIcon>
           <ListItemText onClick={()=>{handleDownloadVideo(bundle)}}>
               Download Video
           </ListItemText>
            
           
        </MenuItem>
      </Menu>
    </div>
  );
}