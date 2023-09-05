/* 
this component handle's the  intial authentication and login
can add other thing's to this
*/



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
