import { useNavigate } from 'react-router-dom';
import '../App.css'

function Navbar(){
const navigate=useNavigate();
    return(
    <div className='navbar' style={{paddingBottom:"50px"}}>
      <div className='text'>
        Expense Tracker

      </div>
      <div style={{fontWeight:"normal", fontSize:"14px",textAutospace:"auto",color:"gray"}}>
        Manage your expenses effortlessly
      </div>
      <button onClick={()=>navigate("/signup")} style={{backgroundColor:"blue",marginLeft:"1540px",fontFamily:"serif",fontSize:"20px",alignSelf:"center"}}>Signup</button>
     
    </div>
    )
}
export default Navbar