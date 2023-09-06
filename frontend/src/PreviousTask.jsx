import  { useState } from 'react';
import axios from 'axios';

function TaskManager({ tasks ,User}) {
  console.log(tasks);

  const [currentTask, setCurrentTask] = useState(null);

  const handleTaskClick = (task) => {
    setCurrentTask(task);
  };

  const handleBackClick = () => {
    setCurrentTask(null); // Set currentTask to null to navigate back to the list of previous tasks
  };

  const handleDownloadVideo = () => {
    console.log('Download video');
  };

  const handleDownloadResources = () => {
    console.log('Download resources');
  };

  const handleDeleteResource = (id,userid,taskid) => {
    // Send a GET request to delete the resource
    axios.get(`http://localhost:3000/delete?fileid=${id}&userid=${userid}&taskid=${taskid}`)
      .then((response) => {
        if (response.status === 200) {
          // Resource deleted successfully, update the current task's resources
          if (currentTask) {
            const updatedResources = currentTask.resources.filter((resource) => resource.media.id !== id);
            setCurrentTask({
              ...currentTask,
              resources: updatedResources,
            });
            console.log(`Resource with ID ${id} deleted successfully.`);
          }
        } else {
          // Handle errors here
          console.error(`Error deleting resource with ID ${id}.`);
        }
      })
      .catch((error) => {
        console.error(`Error deleting resource: ${error}`);
      });
  };
  
  return (
    <div>
      <h1>Task Manager</h1>
      {currentTask ? (
        <div>
          <button onClick={handleBackClick}>Back to Previous Tasks</button> {/* Back button */}
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
                <button onClick={() => handleDeleteResource(resource.media.fileName,User.googleId,currentTask.id)}>Delete</button>
              </div>                  
            ))}
          </div>
          <button onClick={handleDownloadVideo}>Download Video</button>
          <button onClick={handleDownloadResources}>Download Resources</button>
        </div>
      ) : (
        <div>
          {tasks.map((task, index) => (
            <div key={index}>
              <h2>Task {index + 1}</h2>
              <video src={`http://localhost:3000/stream?id=${task.orignalVideo.fileName
}`} controls width="300" height="200" />
              <button onClick={() => handleTaskClick(task)}>
                Hire for this video
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskManager;
