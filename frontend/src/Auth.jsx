import axios from 'axios';

const send=axios.create({
    withCredentials:true //this ensure's that axio's is sending cookies along with the request

})

export default function Auth (){

    function handleClick(){
        window.location.href = 'http://localhost:8000/google';
    }
    return (
        <div>
            <button onClick={handleClick}>Google Sign in</button>
        </div>
    )

}
