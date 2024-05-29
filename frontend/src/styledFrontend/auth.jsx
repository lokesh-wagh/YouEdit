
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import DialogContent from '@mui/material/DialogContent';

import { Card,CardHeader,CardContent, Typography, CardMedia, IconButton ,Snackbar,Alert} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import { useState,useEffect } from 'react';
import { FRONTEND_URL , BACKEND_URL , SERVE_URL , YOUTUBE_URL , TUS_URL } from '../config';
export default function Auth() {
  const [open, setOpen] = useState(false);
  const [snackBar,setSnackBar]=useState(null);
  useEffect(() => {
    setOpen(true); 
  }, []); 

  const handleClick = () => {
    window.location.href =  BACKEND_URL + '/google';
  };

  const handleClose = () => {
    setOpen(true);
    setSnackBar('login');
  };
 function handleShieldSnackBar(){
    setSnackBar('sheild');
  }
  function handleSnackbarClose(){
    setSnackBar(null);
  }
  return (
    <div>
        <Snackbar
          key={0}
          open={snackBar=='sheild'}
          autoHideDuration={6000}
          onClose={() => {handleSnackbarClose()}}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => {handleSnackbarClose()}} severity={'info'}>
            {'Your Data is Safe With Us!!'}
          </Alert>
        </Snackbar>
        <Snackbar
          key={1}
          open={snackBar=='login'}
          autoHideDuration={6000}
          onClose={() => {handleSnackbarClose()}}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => {handleSnackbarClose()}} severity={'warning'}>
            {'You have to login to continue!!'}
          </Alert>
        </Snackbar>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs" // Set the maximum width
        fullWidth // Take up full width
      >
       
        <DialogContent>
            <Card>
                <CardHeader 
                action={<IconButton onClick={
                    ()=>{
                        handleShieldSnackBar();
                    }
                }
                style={{color:'red'}}
                ><ShieldIcon></ShieldIcon></IconButton>}
                title={"Sign in to your account"}
                subheader={"this is necessary for website to function"}
                >
                    <CardMedia>
                        
                    </CardMedia>
                  
                </CardHeader>
                <CardContent style={{alignItems:'center'}}>
                    <Button onClick={handleClick}>
                        SignIn
                    </Button>
                </CardContent>
            </Card>
        </DialogContent>
          
       
      </Dialog>
    </div>
  );
}