import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup(){
    const [email,setEmail]=useState("");
    const[ password,setPassword]=useState("");
    const[fname,setFname]=useState("");
     const[lname,setLname]=useState("");
  
    const navigate=useNavigate();
    function handlesubmit(){
 axios.post("http://localhost:3000/signup",{
        email,
        fname,
        lname,
        password,
    
}
   ).then((res)=>console.log("response from server",res.data),

   )
   .catch((error)=>console.error("error sending data",error));
}
    return(
   
 <div style={{height:"490px",margin:"100px auto",width:"400px", border:"1px solid gray",padding:"20px",boxShadow:""}}>
    <div style={{textAlign:"center"}}><h1>Signup</h1></div>
    <div style={{display:"flex",gap:"20px"}}>
        <div style={{display:"flex",flexDirection:"column"}}>
    <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap",justifyContent:"center"}}>  First name</p>
       <input  value={fname} onChange={(e)=>setFname(e.target.value)} style={{height:"30px"}} type="text"/>
       </div>
       <div style={{display:"flex", flexDirection:"column"}}>
    <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap"}}>Last name</p>
  <input  value={lname} onChange={(e)=>setLname(e.target.value)} style={{height:"30px"}} type="text"/>

    </div>
      
    </div>
    <div style={{display:"flex",flexDirection:"column"}}>
    <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap",justifyContent:"center"}} >  Email</p>
       <input value={email} onChange={(e)=>setEmail(e.target.value)} style={{height:"30px",width:"370px"}} type="text"/>
       </div>
        <div style={{display:"flex",flexDirection:"column"}}>
    <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap",justifyContent:"center"}} >  Password</p>
       <input value={password} onChange={(e)=>setPassword(e.target.value)} style={{height:"30px",width:"370px"}} type="password"/>
       </div>
    <div>
        <button style={{backgroundColor:"black", color:"white", width:"380px",height:"50px",marginTop:" 30px"}}onClick={handlesubmit}>Continue </button>
        <hr style={{marginTop:"30px",width:"374px",marginLeft:"2px"}} />
        <p style={{textAlign:"center"}}>OR</p>
        
        <button style={{backgroundColor:"white", color:"black", width:"380px",height:"50px", fontFamily:"Roboto", fontSize:"20px"}}> Continue With Google</button>
           <p style={{fontFamily:"sans-serif", whiteSpace:"nowrap",textAlign:"center"}}>Already you have an account?{""}
            <span
            style={{color:"blue",cursor:"pointer"}}
            onClick={()=>navigate("/login")}>
               Login
            </span>
           </p>
    </div>
    </div>
    )

    

}
export default Signup;