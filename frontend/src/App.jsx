import axios from 'axios';
import { useEffect, useState } from 'react';
import {Route,Routes} from 'react-router-dom';
import  Upload  from './TusUpload';
import Auth from './Auth'
import CreatorDashboard from './CreatorDashboard'
import LandingPage from './LandingPage'
import CreateTask from './CreateTask';

const send=axios.create({
    withCredentials:true //this ensure's that axio's is sending cookies along with the request

})
function App() {
    const [user,setUser]=useState(null);
    const [authenticated,setAuthenticated]=useState(null);
    console.log(user);
    useEffect(()=>{
        send.get('http://localhost:8000/auth/status'
            )
      .then((response) => {
        setAuthenticated(response.data);
      })    //effect to change the status of app.js
      .catch((err) => {
        console.log(err.message);
      });
    },[])


    useEffect(()=>{
        if(authenticated==false){
            setUser(null); ///if not authenticated set user as false
        }
        if(authenticated==true){
            send.get('http://localhost:8000/user').then((res)=>{
                console.log(res.data);  //if authenticated get the user detail's and true
                setUser(res.data);
            }).catch((err)=>{
                console.log(err.message);
            })
        }
    },[authenticated])
    if(authenticated==null){
        return (<div>
            LOADER MOST PROBABLY BACKEND IS DOWN
        </div>)
    }
    return (authenticated==true?<><Routes>
            <Route path='/' element={<LandingPage/>}></Route>
            <Route path='/creator' element={<CreatorDashboard user={user}/>}></Route>
            <Route path='/upload' element={<Upload User={user==null?{googleId:'11231231'}:user} />}/>
            <Route path='/creator/create-task' element={<CreateTask User={user==null?{googleId:'11231231'}:user}/>}></Route>
        </Routes></>:<Auth></Auth>);
}

export default App;

//<Display Thumbnail={'77aaf00b004ff194ecea69b85cf618eb.png'} Video={'7903e08b7d818b1e34acf5f1bb884117.mp4'}/>
//<Upload User={user==null?{googleId:'11231231'}:user} />