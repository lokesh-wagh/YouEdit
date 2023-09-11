import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Box, Button, ButtonGroup, Card, CardContent, CardHeader,Container,Divider, Grid, IconButton, Menu, MenuItem, Rating, Tooltip, Typography } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { EditRoad, YouTube } from "@mui/icons-material";
export default function Hire({User,task}){
    const [editors,setEditors]=useState(null);
    console.log(editors);
    useEffect(()=>{
        axios.get('http://localhost:8000/hireList').then((res)=>{
            console.log(res.data);
            setEditors(res.data);
        })
    },[]);
    function handleRequest(editorid){
        axios.get('http://localhost:8000/hire',{params:{
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
            <></>
        ):(
            <div style={{padding:'3%'}}>
                <Grid container spacing={3}>
                    {editors.map((editor,index) => {
                    if(editor.googleId!=User.googleId){
                        return(
                            <Grid item xs={4} key={index}>
                                 <Card style={{padding:'1%'}}>
                                        
                                      <CardHeader
                                      action={<DropdownMenu rates={editor.rates}></DropdownMenu>}></CardHeader>
                                      <Avatar src={editor.profileURL} style={{height:'100px',width:'100px',margin:'3vh auto'}}>

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
                                            
                                            
                                            {editor.skills.map((skill,index)=>{
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
                                            editor.qualifications.map((skill,index)=>{
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
function DropdownMenu({rates}) {
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
                  rates.map((rate,index)=>{
                    return(
                      <MenuItem  key={index}>
                         <CapsuleIconButtonWithDropDown rate={rate.rate} description={rate.description} level={rate.level}></CapsuleIconButtonWithDropDown>
                         <IconButton onClick={()=>{alert('hiring editor')}}><YouTube></YouTube></IconButton>
                         
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
        />
  
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} >Description : {description}</MenuItem>
          <MenuItem onClick={handleClose}>Rate : {rate}</MenuItem>
          
          
        </Menu>
      </>
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
        backgroundColor:'#ffffff'
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
    
