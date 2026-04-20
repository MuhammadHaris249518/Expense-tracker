import { useState } from 'react'
import '../App.css'
import axios from 'axios';

function Form({sendData}){
   const[botoncol,setBotoncol]=useState("");

   const updatefiled=(field,value)=>{
      setFormdata({
         ...formdata,
         [field]:value
      })
   }

   function changebuttoncol(botoncol){
 setBotoncol(botoncol);
 setTimeout(()=>{
   setBotoncol("");
 },500)
   
  
   }
   const changehandler=(e)=>{
    setFormdata({
      ...formdata,
      [e.target.name]:e.target.value

    });
   
   }

   const [formdata,setFormdata]=useState({
    title:"",
    category:"",
    date:"",
    amount:"",
    choice:""


});
function sendformtodb(){
 axios.post("http://localhost:3000/transactions",formdata,{
   withCredentials:true
 }

   ).then((res)=>console.log("response from server",res.data),

   )
   .catch((error)=>console.error("error sending data",error));
}
return(
    
 <form onSubmit={(e)=>{
   e.preventDefault();

sendData(formdata);


 }}>
    <div>
        
    <h1 style={{fontSize:"30px"}}>Add Transaction</h1>
    <div style={{display:"flex",flexDirection:"row",gap:"100px"}}>
            <button  type="button" onClick={()=>{changebuttoncol("Expense");updatefiled("choice","Expense");}}   className={botoncol=="Expense"?"changebutton":"button"}style={{marginLeft:"150px"}}>Expense</button>
          <button type="button" onClick={()=>{changebuttoncol("Income");updatefiled("choice","Income");}}    className={botoncol=="Income"?"changebutton":"button"} style={{marginLeft:"3px"}} >Income</button>     
    </div>
   
 
     </div>

    <h3 style={{marginTop:"50px"}}>Title</h3>
    
    <input className='inputtext' type="text" name="title" id=""  value={formdata.title} onChange={changehandler} />

    <h3 style={{marginTop:"50px"}}>Amount</h3>
    
    <input onChange={changehandler}  className='inputtext' type="number" value={formdata.amount} name="amount" id="" />
    <div style={{}}>
    <div style={{display:"flex", flexDirection:"row", gap:"600px"}}>
       <h3 style={{}}>Category</h3>
    <h3>Date</h3>
    </div>
    <div style={{display:"flex", flexDirection:"row", gap:"520px"}}>
       <select onChange={changehandler} value={formdata.category} className='category' name="category" id="Category">
         
       <option  value="food">Food</option>
         <option value="Entertainemet">Entertaniment</option>
           <option value="Transport">Transport</option>
       
</select>

     <input onChange={changehandler} value={formdata.date} className='category' style={{width:"100px"}} type="date" name="date" id="" />
     </div>
</div>
                  <button onClick={()=>{changebuttoncol("Add");sendformtodb()}} className={botoncol=="Add"?"changebutton":"button"}> Add</button> 
          
 </form>
     
    )
}
export default Form