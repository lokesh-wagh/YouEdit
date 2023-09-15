import { useState } from 'react';
import axios from 'axios';

import Finalize from './Finialize';
import Hire from './Hire';

export default function TaskManager({ tasks, User }) {
  const [currentTask, setCurrentTask] = useState(null);
  const [currentThing, setCurrentThing] = useState(null);

  const handleTaskClick = (task,thing) => {
    setCurrentTask(task);
    setCurrentThing(thing);
  };

  const handleBackClick = () => {
    setCurrentTask(null);
    setCurrentThing(null);
  };

  const handleDownloadVideo = () => {
    window.location.href = `http://localhost:3000/download?id=${currentTask.orignalVideo.fileName}`;
    console.log('Download video');
  };

  const handleDownloadResources = () => {
    window.location.href = `http://localhost:3000/download-zip?id=${currentTask.id}`;
    console.log('Download resources');
  };

  const handleDeleteResource = (id, userid, taskid) => {
    axios
      .get(`http://localhost:3000/delete?fileid=${id}&userid=${userid}&taskid=${taskid}`)
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          if (currentTask) {
            const updatedResources = currentTask.resources.filter(
              (resource) => resource.media.fileName !== id
            );
            setCurrentTask({
              ...currentTask,
              resources: updatedResources,
            });
            console.log(`Resource with ID ${id} deleted successfully.`);
          }
        }
      })
      .catch((error) => {
        console.error(`Error deleting resource: ${error}`);
      });
  };

  let content;
  switch (currentThing) {
    case 'edit':
      content = (
        <div>
          <h1>Task Manager</h1>
          <div>
            <button onClick={handleBackClick}>Back to Previous Tasks</button>
            <h2>Task Configuration</h2>
            <video controls width="400">
              <source src={`http://localhost:3000/stream?id=${currentTask.orignalVideo.fileName}`} type={currentTask.orignalVideo.mimeType} />
              Your browser does not support the video tag.
            </video>
            <div>
              <h2>Resources</h2>
              {currentTask.resources.map((resource, index) => (
                <div key={index}>
                  <p>Resource {index + 1}</p>
                  <button onClick={() => handleDeleteResource(resource.media.fileName, User.googleId, currentTask.id)}>Delete</button>
                </div>
              ))}
            </div>
            <button onClick={handleDownloadVideo}>Download Video</button>
            <button onClick={handleDownloadResources}>Download Resources</button>
          </div>
        </div>
      );
      break;
    case 'hire':
      content = (
        <div>
          <button onClick={handleBackClick}>Back to Previous Tasks</button>
          hire
          <Hire User={User} task={currentTask} />
        </div>
      );
      break;
    case 'finalize':
        content=(
          <div>
             <button onClick={handleBackClick}>Back to Previous Tasks</button>
             <Finalize User={User} task={currentTask}></Finalize>
          </div>
        )
    break;
    default:
      content = (
        <div>
          {tasks.map((task, index) => (
            <div key={index}>
              <h2>Task {index + 1}</h2>
              <video src={`http://localhost:3000/stream?id=${task.orignalVideo.fileName}`} controls width="300" height="200" />
              <button onClick={() => handleTaskClick(task,'edit')}>Edit</button>
              <button onClick={() => handleTaskClick(task,'hire')}>Hire</button>
              <button onClick={()=> handleTaskClick(task,'finalize')}>Finalize</button>
            </div>
          ))}
        </div>
      );
  }

  return <div>{content}</div>;
}


    
      
   
          

  



  
  


      