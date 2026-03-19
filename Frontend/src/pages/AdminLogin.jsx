import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/adminLogin.css"

function AdminLogin(){

const [password,setPassword] = useState("")
const navigate = useNavigate()

const handleLogin = (e)=>{

e.preventDefault()

if(password === "Sp@rajuinfra"){

localStorage.setItem("admin","true")
navigate("/sprajuco-dashboard")

}else{

alert("Wrong Password")

}

}

return(

<div className="login-page">

<div className="login-card">

<h2>SP Raju Infra Admin</h2>

<p>Secure login for project management</p>

<form onSubmit={handleLogin}>

<input
type="password"
placeholder="Enter admin password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">
Login
</button>

</form>

</div>

</div>

)

}

export default AdminLogin