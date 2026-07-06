import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/admin.css"

function Admin() {

const BASE_URL = import.meta.env.VITE_API_URL || "https://sp-raju-infra.onrender.com"

const navigate = useNavigate()

const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [status, setStatus] = useState("ongoing")
const [startMonth, setStartMonth] = useState("")
const [startYear, setStartYear] = useState("")
const [possessionMonth, setPossessionMonth] = useState("")
const [possessionYear, setPossessionYear] = useState("")
const [bhkTypes, setBhkTypes] = useState([])
const [propertyType, setPropertyType] = useState("")
const [sft, setSft] = useState("")
const [location, setLocation] = useState("")
const [images, setImages] = useState([])
const [preview, setPreview] = useState([])
const [projects, setProjects] = useState([])
const [editId, setEditId] = useState(null)

/* PROTECT ADMIN PAGE */
useEffect(() => {
const isAdmin = localStorage.getItem("admin")
if (!isAdmin) {
navigate("/sprajuco-login")
return
}
loadProjects()
}, [navigate])

/* LOAD PROJECTS */
const loadProjects = async () => {
try {
const res = await fetch(`${BASE_URL}/projects`)
if (!res.ok) throw new Error("Failed to fetch projects")
const data = await res.json()
setProjects(data)
} catch (error) {
console.error("Error loading projects:", error)
}
}

/* HANDLE IMAGE SELECT */
const handleImageChange = (e) => {
const files = Array.from(e.target.files)
setImages(files)
const previewUrls = files.map(file => URL.createObjectURL(file))
setPreview(previewUrls)
}

/* HANDLE PROPERTY TYPE */
const togglePropertyType = (type) => {
setPropertyType(type)
}

/* HANDLE BHK */
const toggleBHK = (bhk) => {
if (bhkTypes.includes(bhk)) {
setBhkTypes(bhkTypes.filter(b => b !== bhk))
} else {
setBhkTypes([...bhkTypes, bhk])
}
}

/* ADD OR UPDATE PROJECT */
const handleSubmit = async (e) => {
e.preventDefault()

const formData = new FormData()

formData.append("title", title)
formData.append("description", description)
formData.append("status", status)
formData.append("startMonth", startMonth)
formData.append("startYear", startYear)
formData.append("possessionMonth", possessionMonth)
formData.append("possessionYear", possessionYear)
formData.append("propertyType", propertyType)
formData.append("sft", sft)
formData.append("location", location)

formData.append("bhkTypes", JSON.stringify(bhkTypes))

if (images.length > 0) {
images.forEach(img => {
formData.append("images", img)
})
}

try {
let url = `${BASE_URL}/projects`
let method = "POST"

if (editId) {
url = `${BASE_URL}/projects/${editId}`
method = "PUT"
}

const res = await fetch(url, {
method,
body: formData
})

if (!res.ok) throw new Error("Operation failed")

await res.json()

alert(editId ? "Project Updated Successfully!" : "Project Added Successfully!")

resetForm()
loadProjects()

} catch (error) {
console.error("Error:", error)
alert("Failed to save project. Check console.")
}
}

/* EDIT PROJECT */
const editProject = (project) => {
window.scrollTo(0, 0)

setTitle(project.title || "")
setDescription(project.description || "")
setStatus(project.status || "ongoing")
setStartMonth(project.startMonth || "")
setStartYear(project.startYear || "")
setPossessionMonth(project.possessionMonth || "")
setPossessionYear(project.possessionYear || "")
setBhkTypes(project.bhkTypes || [])
setPropertyType(project.propertyType || "")
setSft(project.sft || "")
setLocation(project.location || "")
setEditId(project._id)

if (project.images && project.images.length > 0) {
setPreview(project.images || [])
} else {
setPreview([])
}
}

/* DELETE PROJECT */
const deleteProject = async (id) => {
if (!window.confirm("Are you sure you want to delete this project?")) return

try {
const res = await fetch(`${BASE_URL}/projects/${id}`, {
method: "DELETE"
})

if (!res.ok) throw new Error("Delete failed")

loadProjects()

} catch (error) {
console.error("Delete error:", error)
}
}

/* RESET FORM */
const resetForm = () => {
setTitle("")
setDescription("")
setStatus("ongoing")
setStartMonth("")
setStartYear("")
setPossessionMonth("")
setPossessionYear("")
setBhkTypes([])
setPropertyType("")
setSft("")
setLocation("")
setImages([])
setPreview([])
setEditId(null)
}

/* LOGOUT */
const logout = () => {
localStorage.removeItem("admin")
navigate("/sprajuco-login")
}

return (
<div className="admin-wrapper">

<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
<h1 className="admin-title">Admin Dashboard</h1>

<button
onClick={logout}
className="logout-btn"
style={{
padding: "8px 16px",
background: "#e74c3c",
color: "white",
border: "none",
borderRadius: "5px",
cursor: "pointer"
}}
>
Logout
</button>
</div>

<div className="admin-grid">

{/* FORM */}
<div className="admin-form-card">

<h2>{editId ? "📝 Edit Project" : "➕ Add New Project"}</h2>

<form onSubmit={handleSubmit}>

<input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

<textarea placeholder="Project Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

<div className="form-group">
<label>Project Status</label>
<select value={status} onChange={(e) => setStatus(e.target.value)}>
<option value="ongoing">Ongoing</option>
<option value="completed">Completed</option>
</select>
</div>

<div className="date-section">

<div>
<h4>Start Date</h4>
<select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
<option value="">Month</option>
{["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m}>{m}</option>)}
</select>
<input type="number" placeholder="Year" value={startYear} onChange={(e) => setStartYear(e.target.value)} />
</div>

<div>
<h4>Possession Date</h4>
<select value={possessionMonth} onChange={(e) => setPossessionMonth(e.target.value)}>
<option value="">Month</option>
{["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m}>{m}</option>)}
</select>
<input type="number" placeholder="Year" value={possessionYear} onChange={(e) => setPossessionYear(e.target.value)} />
</div>

</div>

<h4>BHK Types</h4>

<div className="bhk-boxes">
{["2BHK","3BHK","4BHK","5BHK"].map(bhk => (
<div
key={bhk}
className={`bhk-box ${bhkTypes.includes(bhk) ? "active" : ""}`}
onClick={() => toggleBHK(bhk)}
>
{bhk}
</div>
))}
</div>

<h4>Property Type</h4>

<div className="bhk-boxes">
{["Apartment","Villa","Open Plot"].map(type => (
<div
key={type}
className={`bhk-box ${propertyType === type ? "active" : ""}`}
onClick={() => togglePropertyType(type)}
>
{type}
</div>
))}
</div>

<input type="text" placeholder="Area (e.g. 1100 - 1450 SFT)" value={sft} onChange={(e) => setSft(e.target.value)} />

<input type="text" placeholder="Project Location" value={location} onChange={(e) => setLocation(e.target.value)} />

<h4>Upload Images {editId && "(Leave empty to keep existing images)"}</h4>

<input type="file" multiple onChange={handleImageChange} />

<div className="preview-container" style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginTop:"10px" }}>
{preview.map((img,index) => (
<img key={index} src={img} alt="preview" style={{ width:"80px", height:"80px", objectFit:"cover", borderRadius:"6px", border:"1px solid #ddd" }} />
))}
</div>

<div style={{ display:"flex", gap:"10px", marginTop:"20px" }}>
<button type="submit" style={{ flex:2 }}>
{editId ? "Update Project" : "Add Project"}
</button>

{editId && (
<button type="button" onClick={resetForm} style={{ flex:1, background:"#95a5a6" }}>
Cancel
</button>
)}

</div>

</form>

</div>

{/* PROJECT LIST */}
<div className="admin-projects">

<h2>Existing Projects ({projects.length})</h2>

{projects.map(project => (

<div key={project._id} className="admin-project-card">

<div className="project-info">

{project.images && project.images[0] && (
<img
src={project.images[0]}
className="admin-project-image"
alt="thumb"
/>
)}

<div>
<h4>{project.title}</h4>
<p>{project.location} | {project.propertyType}</p>
<span className={`status-badge status-${project.status}`}>
{project.status}
</span>
</div>

</div>

<div className="admin-actions">
<button className="edit-btn" onClick={() => editProject(project)}>Edit</button>
<button className="delete-btn" onClick={() => deleteProject(project._id)}>Delete</button>
</div>

</div>

))}

</div>

</div>

</div>
)
}

export default Admin