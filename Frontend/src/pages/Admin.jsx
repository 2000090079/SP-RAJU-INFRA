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
const data = await res.json()
setProjects(data)
} catch (error) {
console.error(error)
}
}

/* HANDLE IMAGE SELECT */
const handleImageChange = (e) => {
const files = Array.from(e.target.files)
setImages(files)
setPreview(files.map(file => URL.createObjectURL(file)))
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

/* ADD OR UPDATE */
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
images.forEach(img => formData.append("images", img))
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

await res.json()

alert(editId ? "Updated!" : "Added!")

resetForm()
loadProjects()

} catch (err) {
console.error(err)
}
}

/* EDIT */
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

/* ✅ FIXED HERE */
setPreview(project.images || [])
}

/* DELETE */
const deleteProject = async (id) => {
await fetch(`${BASE_URL}/projects/${id}`, { method: "DELETE" })
loadProjects()
}

/* RESET */
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

<h1>Admin Dashboard</h1>

<form onSubmit={handleSubmit}>

<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
<textarea value={description} onChange={e => setDescription(e.target.value)} />

<input type="file" multiple onChange={handleImageChange} />

{/* PREVIEW */}
<div>
{preview.map((img, i) => (
<img key={i} src={img} width="80" />
))}
</div>

<button type="submit">{editId ? "Update" : "Add"}</button>

</form>

<hr />

{/* PROJECT LIST */}
{projects.map(p => (
<div key={p._id}>

{/* ✅ FIXED HERE */}
{p.images?.[0] && (
<img src={p.images[0]} width="100" />
)}

<h3>{p.title}</h3>

<button onClick={() => editProject(p)}>Edit</button>
<button onClick={() => deleteProject(p._id)}>Delete</button>

</div>
))}

</div>
)
}

export default Admin