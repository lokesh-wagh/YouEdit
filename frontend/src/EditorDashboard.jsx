import  { useEffect, useState } from 'react';
import axios from 'axios';

import Upload from './TusUpload'; // Import your upload component
// videoOrdersUploaded should be recieved where in .order contain's all the information
function TaskManagerAndCreateBundle({User,orders }) {
    
  const [currentTask, setCurrentTask] = useState(null);
  const [ycode,setYcode]=useState(0);
  useEffect(()=>{
      axios.get('http://localhost:8000/createbundle').then((res)=>{
        console.log(res);
          setYcode(res.data);        
      })
  },[currentTask]);
    
  const handleUploadClick = (task) => {
    
    setCurrentTask(task);
  };

  const handleBackToNormalView = () => {
  
    setCurrentTask(null);
  };
  function handleFinish(){
    axios.get('http://localhost:8000/finishbundle',{params:{code:ycode,
  id:currentTask.ownerid}}).then((res)=>{
    console.log(res.data);
    window.location.href='http://localhost:5173/editor';
  })
  }
  function handleDownloadVideo(orderId) {
    window.location.href=`http://localhost:3000/download?id=${orderId}`;
    console.log(`Downloading video for Order ${orderId}`);
  }
  
function handleDownloadResources(orderId) {
  window.location.href=`http://localhost:3000/download-zip?id=${orderId}`
  console.log(`Downloading resources for Order ${orderId}`);
}
  

  return (
    <div>
      {currentTask === null ? (
     
        <div>
          {orders.map((order) => (
            <div key={order.order.id}>
              <h1>This is order view</h1>
              <h2>Order {order.order.id}</h2>
              <video controls width="400">
                <source src={`http://localhost:3000/stream?id=${order.order.orignalVideo.fileName}`} type={order.order.orignalVideo.mimeType} />
                Your browser does not support the video tag.
              </video>
              <button onClick={() => handleDownloadVideo(order.order.orignalVideo.fileName)}>Download Video</button>
              <button onClick={() => handleDownloadResources(order.order.id)}>Download Resources</button>
              <button onClick={() => handleUploadClick(order)}>Upload</button>
            </div>
          ))}
        </div>
      ) : (
        
        <div>
          <button onClick={handleBackToNormalView}>Back to Normal View</button>
          <h2>Upload View for Order {currentTask.order.id}</h2>
          {/* Render the UploadComponent with the currentTask */}
          <Upload User={User} code={currentTask.order.id} role={'editedVideo'} bundlereciever={currentTask.ownerid} ycode={ycode}/>
          <Upload User={User} code={currentTask.order.id} role={'editedThumbnail'} bundlereciever={currentTask.ownerid} ycode={ycode}/>
          <button onClick={handleFinish}>finish editing upload</button>
        </div>
      )}
    </div>
  );
}







export default TaskManagerAndCreateBundle;
