import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Avatar, ButtonGroup, Card, CardContent, CardHeader,Container,Divider, Grid, IconButton, Menu, MenuItem, Rating, Snackbar, Tooltip, Typography } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import {  YouTube } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { BACKEND_URL , FRONTEND_URL, SERVE_URL,YOUTUBE_URL,TUS_URL } from '../config';
export default function Hire({User,task}){
    const [editors,setEditors]=useState(null);
 
    useEffect(()=>{
        axios.get(BACKEND_URL + '/hireList').then((res)=>{
            console.log(res.data);
            setEditors(res.data);
        })
    },[]);
    function handleRequest(editorid){
        axios.get(BACKEND_URL + '/hire',{params:{
            editorid:editorid,
            ownerid:User.googleId,
            taskid:task.id,
        }}).then(()=>{
            console.log('success in hiring');
        })
    }
   
    return(
        <>
        {
        editors==null?(
          <Snackbar
          open={true}
          autoHideDuration={null} // Set to `null` to make it not automatically close
          onClose={()=>{}}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Alert
            severity="info"
           
          >
            No Editor to Be Hired
          </Alert>
        </Snackbar>
  
        ):(
            <div style={{padding:'3%'}}>
                <Grid container spacing={3}>
                    {editors?.map((editor,index) => {
                    if(editor.googleId!=User.googleId){
                        return(
                            <Grid item xs={4} key={index}>
                                 <Card style={{padding:'1%',border:'2px solid gold'}}>
                                        
                                      <CardHeader
                                      action={<DropdownMenu rates={editor.rates} editorid={editor.googleId} handleRequest={handleRequest}></DropdownMenu>}></CardHeader>
                                      <Avatar src={editor.profileURL} style={{height:'100px',width:'100px',margin:'3vh auto',border:'4px solid lime'}}>

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
                                                {editor.rating}.0
                                            </Grid>
                                          </Grid>
                                         
                                        
                                         
                                           
                                            <Container  style={{marginTop:'2vh',marginBottom:'2vh', textAlign:'center'}} >
                                              <Typography>{editor.googleId}</Typography>
                                              <Typography variant="body2" color="textSecondary" component="p">
                                              {editor.description}
                                              </Typography>
                                            </Container>
                                           
                                            
                                            <ButtonGroup style={{marginTop:'2vh',marginBottom:'2vh'}}>
                                            
                                            
                                            {editor.skills?.map((skill,index)=>{
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
                                            editor.qualifications?.map((skill,index)=>{
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
                            </Grid>
                        )
                    }
                    else{
                        return (<></>)
                    }
                    })}
                </Grid>
            </div>
            
              
           
        )
        }
        </>
    )

        }
function DropdownMenu({rates,editorid,handleRequest}) {
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
                style={{color:'gold'}}
              >
               <AttachMoneyOutlinedIcon></AttachMoneyOutlinedIcon>
              </IconButton>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {
                  rates?.map((rate,index)=>{
                    return(
                      <MenuItem  key={index}>
                         <CapsuleIconButtonWithDropDown rate={rate.rate} description={rate.description} level={rate.level}></CapsuleIconButtonWithDropDown>
                         <IconButton onClick={()=>{handleRequest(editorid)
                          handleClose()
                        }}
                        style={{color:'red'}}><YouTube></YouTube></IconButton>
                         
                      </MenuItem>
                    )
                  })
                }
              
              </Menu>
            </div>
          );
        }
        
function CapsuleIconButtonWithDropDown({rate,level,description}){
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        console.log(event)
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
    <>
        <CapsuleIconButton
          text={level}
          onClick={(e)=>{handleMenuClick(e)}}
          style={{backgroundColor:'gold',fontSize:'2vh',fontFamily:'sans-serif'}}
        
        />
  
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} style={{color:'black', fontSize:'2vh',fontFamily:'sans-serif'}} >Description : {description}</MenuItem>
          <MenuItem onClick={handleClose} style={{color:'black', fontSize:'2vh',fontFamily:'sans-serif'}}>Rate : {rate}</MenuItem>
          
          
        </Menu>
      </>
    );
  }
        
 function CapsuleIconButton({ text,onClick,style}) {
    const capsuleButtonStyle = { 
      
      borderRadius: '999px', // Makes the button shape like a capsule
      padding: '7px 14px', // Adjust padding as needed
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin:'2px',
      height:'8%',
        backgroundColor:'#F7F9FC',
        border:'2px solid gold',
      ...style,
    };
  
    const typographyStyle = {
      marginLeft: '8px',
      color:'black',
      fontFamily:'sans-serif'
    };
  
    return (
      <IconButton style={capsuleButtonStyle} onClick={(e)=>{
        if(onClick!=null){
            onClick(e);
        }
      }}>
       
        <Typography variant="body1" style={typographyStyle} >
          {text}
        </Typography>
      </IconButton>
    );
  }
    
