import Upload from './TusUpload';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CreateTask({ User }) {
    const [taskCode,setTaskCode]=useState(null);  
  function handleSubmit()
    { console.log(taskCode)
      console.log(User.googleId);
      if(taskCode==null){
        return;
      }
      axios.get('http://localhost:8000/finishtask',{params:{
        code:taskCode,
        id:User.googleId,
      }}).then(()=>{
        window.location.href='http://localhost:5173/creator';
      })
    } 
    useEffect(()=>{
      axios.get('http://localhost:8000/createtask').then((res)=>{
        console.log(res.data);
        setTaskCode(res.data);
      })
    },[]) 
    return (
    <div>
      <div>
        <h2>Upload Video</h2>
        <p>Upload your video here:</p>
        <Upload User={User} code={taskCode} role={'orignalvideo'}/>
      </div>

      <div>
        <h2>Upload Resources</h2>
        <p>Upload your resources here:
            Please Make uploads one by one until we figure out how to multiple upload on this protocol through uppy
        </p>
        {/* <MultipleUpload User={User} /> */}
        <Upload User={User} code={taskCode} role={'resource'}/>
        
      </div>
      <button onClick={handleSubmit}>Finish creating</button>
    </div>
  );
}