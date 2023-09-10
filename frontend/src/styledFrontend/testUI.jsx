import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AddCircleOutlineOutlined, SubjectOutlined } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Auth from '../Auth';
import PreviousTask from '../PreviousTask';
import CreatorDashboard from '../CreatorDashboard';
import LandingPage from '../LandingPage';
import CreateTask from './CreateTask';
import EditorDashboard from '../Editordashboard';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import EmergencyRecordingRoundedIcon from '@mui/icons-material/EmergencyRecordingRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { IconButton } from '@mui/material';

const send = axios.create({
  withCredentials: true, // this ensures that axios is sending cookies along with the request
});

function App() {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
 
  

  useEffect(() => {
    send.get('http://localhost:8000/auth/status')
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
      send.get('http://localhost:8000/user')
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [authenticated]);

  if (user === null) {
    send.get('http://localhost:8000/user')
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
     
      <Layout>
        <Routes>
       
            <Route path='/' element={<LandingPage />} />
            <Route path='/creator' element={<CreatorDashboard user={user} />} />
            <Route path='/creator/create-task' element={<CreateTask User={user || { googleId: '11231231' }} />} />
            <Route path='/creator/previous-tasks/*' element={<PreviousTask User={user || { googleId: '11231231' }} tasks={(user && user.tasks) || {}} />} />
            <Route path='/editor' element={<EditorDashboard User={user || { googleId: '11231231' }} orders={(user && user.videoOrdersAssigned) || {}} />} />
          
        </Routes>
      </Layout>
      
    </>
  ) : (
    <Auth />
  );
}

const drawerWidth = 300;
const appbarHeight=7;
const menuItemsCreator = [
  {
    text: 'See Previous Editing',
    icon: <SubjectOutlined color="secondary" />,
    path: '/creator/previous-tasks/'
  },
  {
    text: 'Get a Video Edited',
    icon: <AddCircleOutlineOutlined color="secondary" />,
    path: '/creator/create-task'
  },
  
]
const menuItemsEditor=[
  {
    text:'See Your Editing Orders',
    icon:<AddCircleOutlineOutlined color="secondary" />,
    path:'/editor'
  }
]

function Layout({ children}) {
  const [selectedItem,setSelectedItem]=useState(null);
  const [menuItems,setMenuItems]=useState(menuItemsCreator);
  const history = useNavigate();
  const location = useLocation();
  // const menuItems=menuItemsCreator;
  // function setMenuItems()
  // {

  // }
  const theme = createTheme({
    palette: {
      primary: {
        light:'#009be5',
        dark:'#081627',
        main: '#1a73e8', // Google Docs' blue color
      },
      secondary: {
        main: '#D3E3FD', // White color
      },
      background: {
        default: '#ffffff', // White background
        paper: '#f1f3f4',   // Light gray paper background
      },
      text: {
        primary: '#333333', // Primary text color
        secondary: '#666666', // Secondary text color
      },
    },
    typography: {
      fontFamily: 'Arial, sans-serif', // You can adjust the font family
      fontSize: 16,
    },
    spacing: 8,
  });
  

  

  return (
    <ThemeProvider theme={theme}>
    <div style={{ display: 'flex',background:'#f1f3f4'}}>
      {/* app bar */}
      <AppBar
        position="fixed"
        style={{ width: 'calc(100% - ' + drawerWidth + 'px)', marginLeft: drawerWidth,background:'#f1f3f4'}}
        elevation={0}
     
      >
        <Toolbar style={{height:appbarHeight+'vh'}}>
          <Typography style={{ flexGrow: 1 }}>
            Today is the Lauden bhujyam day
          </Typography>
          <IconButton onClick={()=>{
            setSelectedItem(0);
            setMenuItems(menuItemsEditor)}}>
            <EditRoundedIcon fontSize='large'></EditRoundedIcon>
          </IconButton>
          <IconButton onClick={()=>{
            setSelectedItem(0);
            setMenuItems(menuItemsCreator)}}>
            <EmergencyRecordingRoundedIcon fontSize='large'></EmergencyRecordingRoundedIcon>
          </IconButton>
          <Avatar style={{ marginLeft: '2rem' }} src="/mario-av.png" />
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <Drawer
        
        style={{ width: drawerWidth }}
        variant="permanent"
        
        PaperProps={{sx:{
          width:drawerWidth,
          border:'none',  
        }}}
        anchor="left"
      >
        <div>
          <Typography variant="h5" style={{ padding: '2rem' }}>
            Ninja Notes
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
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* main content */}
      <div className='guySittingonPage' style={{ background: '#ffffff', width: '83%', marginTop: appbarHeight+2+'vh',height:100-appbarHeight-4+'vh',borderRadius:'1vh'}}>
        <div className='canvasGuy' style={{ height: `calc(100%-${appbarHeight}vh`,width:'100%' }}>
          {children}
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
}



export default App;
