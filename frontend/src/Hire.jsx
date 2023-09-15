import { useEffect, useState } from "react";
import axios from "axios";
export default function Hire({User,task}){
    const [editors,setEditors]=useState(null);
    useEffect(()=>{
        axios.get('http://localhost:8000/hireList').then((res)=>{
            console.log(res.data);
            setEditors(res.data);
        })
    },[]);
    function handleRequest(editorid){
        axios.get('http://localhost:8000/hire',{params:{
            editorid:editorid,
            ownerid:User.googleId,
            taskid:task.id,
        }}).then(()=>{
            console.log('success in hiring');
        })
    }
    return(
        <>
        {
        editors==null?(
            <></>
        ):(
            <div>
            <h2>User List</h2>
            <ul>
              {editors.map(( editor) => {
                if(editor.googleId!=User.googleId){
                    return(
                        <li key={editor.googleId}>
                        <span>{editor.username}</span>
                        <button onClick={() => handleRequest(editor.googleId)}>Request Editor</button>
                        </li>
                    )
                }
                else{
                    return (<></>)
                }
                })}
            </ul>
          </div>
        )
        }
        </>
    )

        }
     
    
