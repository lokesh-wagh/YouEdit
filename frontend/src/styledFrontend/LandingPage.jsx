import { Card, CardMedia, Grid } from "@mui/material";

function LandingPage() {
 return (
  <Grid container style={{marginTop:'10%'}}>
    <Grid item xs={4}></Grid>
    <Grid item xs={4}>
    <Card>
      <CardMedia
      component={'img'}
      src={"http://localhost:3000/resource/websiteLogo"}
      >
      
      </CardMedia>
    </Card>
    </Grid>
  </Grid>
 
 )
}

export default LandingPage;