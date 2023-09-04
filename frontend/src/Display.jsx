import axios from "axios";
const send=axios.create({
  withCredentials:true //this ensure's that axio's is sending cookies along with the request

})
function Display({ Video,Thumbnail }) {
  function handleClick(){
  //   send
  // .get('http://localhost:5000/login', { params: {url:Video} })
  // .then((response) => {
  //   // Handle the server's response here
    
  //   console.log('Server Response:', response.data);
  // })
  // .catch((error) => {
  //   // Handle any errors that occurred during the request
  //   console.error('Error:', error.message);
  // });
  window.location.href = `http://localhost:5000/login?url=${Video}`;
  }
  return (
    <div>
      <h2>Video Display</h2>
      <video controls width="640" height="360">
        <source src={'http://localhost:3000/stream?url='+Video} type="video/mp4" />
        {/* Add additional source elements for different video formats if needed */}
        Your browser does not support the video tag.
      </video>
      <div>
        <h2>Image Display</h2>
        <img src={'http://localhost:3000/thumbnail?url='+Thumbnail} alt="Image Description" />
    </div>
    <button onClick={handleClick}>Upload</button>
    </div>
  );
}

export default Display;
