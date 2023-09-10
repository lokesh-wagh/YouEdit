
export default function Finalize({User,task}){

    
    function handleDownloadVideo(bundle) {
      window.location.href = `http://localhost:3000/download?id=${bundle.video.fileName}`;
      console.log('Download video');
    }
    function finalize(bundle){
      const param=JSON.stringify(bundle);
      window.location.href='http://localhost:5000/login?bundle='+param;
    }
    function handleDownloadThumbnail (bundle)  {
      window.location.href = `http://localhost:3000/download?id=${bundle.thumbnail.fileName}`;
      console.log('Download resources');
    }
      return (
          <div>
              this is finalize view
              {task.editedVideo.length > 0 && (
          <div>
            <h2>Uploaded Videos</h2>
            {task.editedVideo.map((bundle, index) => (
              <div key={index}>
                <h3>Video {index + 1}</h3>
                <h2>By {bundle.editor.username}</h2>
                <video controls width="400">
                  <source src={`http://localhost:3000/stream?id=${bundle.video.fileName}`} type={bundle.video.mimeType} />
                  Your browser does not support the video tag.
                </video>
                <img src={`http://localhost:3000/stream?id=${bundle.thumbnail.fileName}`} alt={`Thumbnail ${index + 1}`} width="200" />
  
                <button onClick={() => handleDownloadVideo(bundle)}>Download Video</button>
                <button onClick={() => handleDownloadThumbnail(bundle)}>Download Thumbnail</button>
                <button onClick={()=>{finalize(bundle)}}>Finalize!!</button>
              </div>
            ))}
          </div>
        )}
          </div>
      )
  }