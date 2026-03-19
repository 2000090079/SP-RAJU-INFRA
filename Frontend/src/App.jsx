import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Home/>} />

<Route path="/sprajuco-login" element={<AdminLogin/>} />

<Route path="/sprajuco-dashboard" element={<Admin/>} />

</Routes>

</BrowserRouter>

)

}

export default App