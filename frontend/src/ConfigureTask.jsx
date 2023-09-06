

import  { useState } from 'react';
import axios from 'axios';

function ConfigureTask({ task }) {
  const [resources, setResources] = useState(task.resources);

  function renderResources() {
    return resources.map((resource, index) => (
      <div key={index}>
        <p>Resource {index + 1}</p>
        <button onClick={() => handleDeleteResource(resource.media.id)}>Delete</button>
      </div>
    ));
  }

  function handleDeleteResource(id) {
    // Send a GET request to delete the resource
    axios.get(`http://localhost:3000/delete?id=${id}`)
      .then((response) => {
        if (response.status === 200) {
          // Resource deleted successfully, update the state to reflect the change
          const updatedResources = resources.filter((resource) => resource.media.id !== id);
          setResources(updatedResources);
          console.log(`Resource with ID ${id} deleted successfully.`);
        } else {
          // Handle errors here
          console.error(`Error deleting resource with ID ${id}.`);
        }
      })
      .catch((error) => {
        console.error(`Error deleting resource: ${error}`);
      });
  }

  function handleDownloadVideo() {
    console.log('Download video');
  }

  function handleDownloadResources() {
    console.log('Download resources');
  }

  return (
    <div>
      <h1>Task Configuration</h1>
      <video controls width="400">
        <source src={`http://localhost:3000/stream?id=${task.originalVideo.fileName}`} type={task.originalVideo.mimeType} />
        Your browser does not support the video tag.
      </video>
      <div>
        <h2>Resources</h2>
        {renderResources()}
      </div>
      <button onClick={handleDownloadVideo}>Download Video</button>
      <button onClick={handleDownloadResources}>Download Resources</button>
    </div>
  );
}

export default ConfigureTask;
