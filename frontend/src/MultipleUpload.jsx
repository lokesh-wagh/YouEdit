import {useRef, useState} from 'react';
import * as tus from 'tus-js-client'

export default function MultipleUpload({User}) {

    const [upload,setUpload]=useState(null);
    const [data,setData]=useState('no file selected');
    const inputRef=useRef(null);
    const pauseButtonRef=useRef(null);
    const resumeButtonRef=useRef(null);
    const googleid=User.googleId;
    const handleFileChange = () => {
        pauseButtonRef.current.disabled = false;
        resumeButtonRef.current.disabled = false;
    
        const files = Array.from(inputRef.current.files);
        if (files.length > 0) {
          const uploadInstances = files.map((file) => {
            const upload = new tus.Upload(file, {
              endpoint: 'http://localhost:1080/files/',
              retryDelays: [0, 3000, 5000, 10000, 20000],
              metadata: {
                filename: file.name,
                filetype: file.type,
                id: googleid,
              },
              onError: function (error) {
                setData('Failed because: ' + error);
              },
              onProgress: function (bytesUploaded, bytesTotal) {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                setData(percentage + '%');
              },
              onSuccess: function () {
                pauseButtonRef.current.disabled = true;
                resumeButtonRef.current.disabled = true;
                setData(
                  'Upload completed successfully. Select a new file to unlock resume and pause.'
                );
              },
            });
    
            
            return upload;
          });
    
          // Store the upload instances in state for later management
          setUpload(uploadInstances);
        }
      };


  function stopUpload(){
    if(upload!=null){
        for(let i=0;i<upload.length;i++){
            upload[i].abort();
        }
    }
  }


  function resumeUpload() {
    if (upload != null) {
      for (let i = 0; i < upload.length; i++) {
        upload[i].findPreviousUploads().then(function (previousUploads) {
          if (previousUploads.length) {
            for (let j = 0; j < previousUploads.length; j++) {
              upload[i].resumeFromPreviousUpload(previousUploads[j]);
            }
          }
          upload[i].start();
        });
      }
    }
  }
  
   
  return (
    <div>
        <div className='display'>
          {data}
        </div>
        <input ref={inputRef} type="file" id="file" name="file" onChange={handleFileChange} multiple/>
        
        <button ref={resumeButtonRef} onClick={resumeUpload}>Resume</button>
        <button ref={pauseButtonRef} onClick={stopUpload}>Pause</button>
    </div>
  );
}
