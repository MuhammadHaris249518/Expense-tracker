import { useState } from "react";
import Cards from "./Components/Cards";
import Navbar from "./Components/navbar";
import Form from "./Components/form";
import Signup from "./Components/signup";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import login from "./Components/login";
import Login from "./Components/login";
function App(){

  const[list,setList]=useState([]);
  const[autdata,setAudata]=useState([
    {
      firstname:"",
      lastname:"",
      email:"",
      password:"",


    }
  ])



  const[bamount,setBamount]=useState(0);
   const[iamount,setIamount]=useState(0);
   
    const[eamount,setEamount]=useState(0);
   function totalcal(formdata){
   
   const amount=Number(formdata.amount);

    if(formdata.choice=="Expense"){
     setEamount(prev=>prev+amount)
     setBamount(prev=>prev-amount)
    }
    else if (formdata.choice=="Income"){
      setIamount(prev => prev+amount)
      setBamount(prev=>prev+amount)
    }
    setList(prev=>[...prev,formdata]);
   }
   
 
  return(

  
  <BrowserRouter>
    <Routes>
    <Route path="/" element={
    <div>
      <div style={{marginTop:"-5px"}} > 
      <Navbar/>
      </div> 
      <div className="container">
    <Cards title="Total Balance"  bamount={bamount}/>
      <Cards title="Total Income" iamount={iamount} />
       <Cards title="Total Expenses" eamount={eamount} />
       
       </div>
       <div style={{display:"flex"}}>
       <div className="bar">
<Form sendData={totalcal}/>
      </div>
    
      <div className="card" style={{marginTop:"15px", height:"600px"}}>
         <div style={{display:"flex", flexDirection:"column"}}>
      <h1 style={{marginLeft:"40px"}}>Recent Transactions</h1>
  {list.map((item,index)=>
            <div className="recenttransactionsbox" >
  
   <div key={index} className="recenttransactions">
        <h1 style={{alignSelf:"flex-start", color:"black",fontFamily:"serif",fontSize:"40px",whiteSpace:"nowrap", marginTop:"20px", wordBreak:"break-word"}} className="text">{item.title}</h1>
         <h2 style={{marginLeft:"160px",color:"red",fontSize:"30px",fontFamily:"serif"}}>${item.amount}</h2>
            </div>
  <div key={index} className="recenttransactions">
      <p style={{alignSelf:"flex-start",fontSize:"15px",color:"gray",fontFamily:"math",marginTop:"20px", whiteSpace:"nowrap"}}>{item.date}</p>
         <p  style={{marginLeft:"140px",fontSize:'15px',color:"gray"}}>{item.category}</p>
       
    </div>
   
</div>
  )}
      </div>-
      </div>

    </div>
      
    </div>
    }/>
    
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
    </Routes>

     </BrowserRouter>
    
  )
}

export default App;