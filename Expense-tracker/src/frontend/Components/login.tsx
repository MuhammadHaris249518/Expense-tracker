import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login(){
const[errormsg,setErrormsg]=useState("");
const navigate=useNavigate();
const [email,setEmail]=useState("");
const[password,setPassword]=useState("");
function handlelogin(){
 axios.post("http://localhost:3000/login",{
        email,
        password,
  } ,{
         withCredentials:true
        
    
}
   ).then((res)=>{console.log("response from server",res.data);
   

if(res.data.success){
   navigate("/")
}
   }
)
    
   .catch((error)=>console.error("error sending data",error));
   setErrormsg("Invlaid password");
}


  
return(
 
    <div style={{height:"490px",margin:"100px auto",width:"400px", border:"1px solid gray",padding:"20px",boxShadow:""}}>
    <div style={{textAlign:"center"}}><h1>Login</h1></div>
    <div style={{display:"flex",flexDirection:"column"}}>
    <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap",justifyContent:"center"}} >  Email</p>
       <input style={{height:"30px",width:"370px"}} type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
       </div>
         <div style={{display:"flex",flexDirection:"column"}}>
    <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap",justifyContent:"center"}} >  Password</p>
       <input style={{height:"30px",width:"370px"}} type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
       </div>
    <div>
        <button onClick={handlelogin} style={{backgroundColor:"black", color:"white", width:"380px",height:"50px",marginTop:" 30px"}}>Continue</button>
        <p style={{color:"red"}}>{errormsg}</p>
        <hr style={{marginTop:"30px",width:"374px",marginLeft:"2px"}} />
        <p style={{textAlign:"center"}}>OR</p>
        
        <button style={{backgroundColor:"white", color:"black", width:"380px",height:"50px", fontFamily:"Roboto", fontSize:"20px"}}> Continue With Google</button>
           <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap",textAlign:"center"}}>Did not have an account?{""}
            <span
            style={{color:"blue",cursor:"pointer"}}
            onClick={()=>navigate("/signup")}>
               Signup
            </span>
           </p>
    </div>
 </div>


)

}
export default Login;
