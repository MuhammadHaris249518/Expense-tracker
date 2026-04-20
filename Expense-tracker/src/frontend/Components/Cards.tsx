import '../App.css'
interface cardprops{
    title:string,
    eamount:number,
    iamount:number,
    bamount:number,

}
function Cards(props:cardprops){
    return(
     <div className='container'>
        <div className='card'>
            <div  style={{color:"red", fontFamily:"sans-serif"}}>
     <div style={{color:"black", fontSize:"20px",fontWeight:"normal"}}>
            {props.title}
     </div>
    
        <br />
        <div style={{color:"red", fontSize:"30px",fontWeight:"bold"}}>
        {props.eamount}
        {props.iamount}
        {props.bamount}
        </div>
        
            </div>
            
            </div>
            
     </div>
    )
}
export default Cards