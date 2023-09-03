import axios from 'axios';
import { useEffect } from 'react';
import Upload from './TusUpload'
const send=axios.create({
    withCredentials:true //this ensure's that axio's is sending cookies along with the request
    
})
function App() {
    useEffect(()=>{
        send.get('http://localhost:8000/'
            )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
    },[])
    return (<Upload/>);
}

export default App;