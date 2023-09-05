import axios from 'axios';
import { useEffect, useState } from 'react';
import Upload from './TusUpload'
import Auth from './Auth'
import Display from './Display';
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
    return (authenticated==true?<Display Video={'b94ce0ffd5039431160207baf4846b01.mp4'} Thumbnail={'21424075181d3ab092edb389a2aed317.png'}></Display>:<Auth onComplete={setAuthenticated}/>);
}

export default App;