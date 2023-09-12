import { Avatar, Card, CardContent, CardHeader, CardMedia, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

export default function Finalize({User,task}){

    console.log(task);
    function handleDownloadVideo(bundle) {
      window.location.href = `http://localhost:3000/download?id=${bundle.video.fileName}`;
      console.log('Download video');
    }
    function finalize(bundle){
      const param=JSON.stringify(bundle);
      window.location.href='http://localhost:5000/login?bundle='+param;
    }
    function handleDownloadThumbnail (bundle)  {
      window.location.href = `http://localhost:3000/download?id=${bundle.thumbnail.fileName}`;
      console.log('Download resources');
    }
      return (
        <div style={{padding:'2%'}}>
         
          <Grid container spacing={3}>
             {task.editedVideo.map((bundle,index)=>{
              return(
                <Grid item key={index} xs={4}>
                  <Card>
                    <CardHeader
                      title={`edited by ${bundle.editor.username}`}
                      avatar={<Avatar src={bundle.editor.profileURL}></Avatar>}
                      action={<DropdownMenu bundle={bundle} 
                      handleDownloadThumbnail={handleDownloadThumbnail} 
                      handleDownloadVideo={handleDownloadVideo} 
                      finalize={finalize}></DropdownMenu>}
                    >
                      </CardHeader>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                      <CardMedia 
                        component={'video'}
                        controls
                        src={`http://localhost:3000/stream?id=${bundle.video.fileName}`}
                        title={`video by editor`}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        
                    <CardMedia
                      
                      component={'img'}
                      src={`http://localhost:3000/stream?id=${bundle.thumbnail.fileName}`}
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
                <IconButton onClick={()=>{finalize(bundle)}}>
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
                <IconButton onClick={()=>{handleDownloadThumbnail(bundle)}}>
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
                <IconButton onClick={()=>{handleDownloadVideo(bundle)}}>
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