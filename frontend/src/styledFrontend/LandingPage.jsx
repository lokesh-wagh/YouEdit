import { Card, CardMedia, Grid } from "@mui/material";
import { BACKEND_URL , FRONTEND_URL, SERVE_URL,YOUTUBE_URL,TUS_URL } from '../config';
function LandingPage() {
 return (
  <Grid container style={{marginTop:'10%'}}>
    <Grid item xs={4}></Grid>
    <Grid item xs={4}>
    <Card>
      <CardMedia
      component={'img'}
      src={SERVE_URL + "/resource/websiteLogo"}
      >
      
      </CardMedia>
    </Card>
    </Grid>
  </Grid>
 
 )
}

export default LandingPage;