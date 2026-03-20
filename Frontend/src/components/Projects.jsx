import { useState, useEffect } from "react"

function Projects(){

const BASE_URL = import.meta.env.VITE_API_URL || "https://sp-raju-infra.onrender.com"

const [projects,setProjects] = useState([])
const [selectedProject,setSelectedProject] = useState(null)
const [currentImage,setCurrentImage] = useState(0)
const [filter,setFilter] = useState("all")
const [visibleCount,setVisibleCount] = useState(6)

/* LOAD PROJECTS */

useEffect(()=>{
loadProjects()
},[])

/* RESET PROJECT COUNT WHEN FILTER CHANGES */

useEffect(()=>{
setVisibleCount(6)
},[filter])

const loadProjects = async ()=>{

try{

const res = await fetch(`${BASE_URL}/projects`)
const data = await res.json()

const sortedProjects = data.sort((a,b)=>
Number(b.startYear) - Number(a.startYear)
)

setProjects(sortedProjects)

}catch(error){
console.log(error)
}

}

/* OPEN PROJECT MODAL */

const openProject = (project)=>{
setSelectedProject(project)
setCurrentImage(0)
}

/* CLOSE MODAL */

const closeModal = ()=>{
setSelectedProject(null)
}

/* NEXT IMAGE */

const nextImage = () => {
  if (!selectedProject?.images?.length) return

  setCurrentImage(prev =>
    prev < selectedProject.images.length - 1 ? prev + 1 : 0
  )
}

/* PREVIOUS IMAGE */

const prevImage = () => {
  if (!selectedProject?.images?.length) return

  setCurrentImage(prev =>
    prev === 0 ? selectedProject.images.length - 1 : prev - 1
  )
}

/* FILTER PROJECTS */

const filteredProjects = projects
.filter(project => {
if(filter === "all") return true
return project.status === filter
})
.slice(0,visibleCount)

return(

<section id="projects" className="projects-section">

<h2 className="section-title">Our Projects</h2>

<div className="project-filters">

<button
className={filter==="all" ? "active" : ""}
onClick={()=>setFilter("all")}
>
All
</button>

<button
className={filter==="ongoing" ? "active" : ""}
onClick={()=>setFilter("ongoing")}
>
Ongoing
</button>

<button
className={filter==="completed" ? "active" : ""}
onClick={()=>setFilter("completed")}
>
Completed
</button>

</div>


<div className="projects-grid">

{filteredProjects.map(project => (

<div
key={project._id}
className="project-card"
onClick={()=>openProject(project)}
>

<img
  loading="lazy"
  src={
    project.images?.[0]?.includes("cloudinary")
      ? project.images[0].replace("/upload/", "/upload/w_600,q_auto,f_auto/")
      : project.images?.[0] || "/no-image.png"
  }
  alt={project.title}
/>

<div className="project-content">

<h3>{project.title}</h3>

<p>{project.description}</p>

<span className={`status-badge status-${project.status}`}>
{project.status}
</span>

</div>

</div>

))}

</div>


{visibleCount < projects.filter(p => filter === "all" ? true : p.status === filter).length && (

<div className="expand-btn-container">

<button
className="expand-btn"
onClick={()=>setVisibleCount(visibleCount + 6)}
>
View More Projects
</button>

</div>

)}


{/* PROJECT MODAL */}

{selectedProject && (

<div className="project-modal" onClick={closeModal}>

<div className="modal-content" onClick={(e)=>e.stopPropagation()}>

<button className="close-btn" onClick={closeModal}>
✕
</button>


{/* LEFT IMAGE SLIDER */}

<div className="modal-left">

<button onClick={prevImage} className="slider-btn left">
‹
</button>

<img
  loading="lazy"
  src={
    selectedProject.images?.[currentImage]?.includes("cloudinary")
      ? selectedProject.images[currentImage].replace("/upload/", "/upload/w_800,q_auto,f_auto/")
      : selectedProject.images?.[currentImage] || "/no-image.png"
  }
  alt={selectedProject.title}
/>

<button onClick={nextImage} className="slider-btn right">
›
</button>

</div>


{/* RIGHT SIDE PROJECT INFORMATION */}

<div className="modal-right">

<div className="project-header">

<h2 className="project-title">
{selectedProject.title}
</h2>

</div>


<h3 className="project-subtitle">
Project Details
</h3>


<div className="project-details">


<div className="project-detail-card">
<span>Property Type</span>
<strong>{selectedProject.propertyType || "N/A"}</strong>
</div>


<div className="project-detail-card">
<span>Status</span>
<strong>
{selectedProject.status === "completed" ? "Completed" : "Ongoing"}
</strong>
</div>


<div className="project-detail-card">
<span>No. of BHK</span>
<strong>
{selectedProject.bhkTypes && selectedProject.bhkTypes.length > 0
? selectedProject.bhkTypes
.map(b => parseInt(b))
.sort((a,b)=>a-b)
.map(b => `${b}BHK`)
.join(" & ")
: "N/A"}
</strong>
</div>


<div className="project-detail-card">
<span>Area</span>
<strong>
{selectedProject.sft ? `${selectedProject.sft} SFT` : "N/A"}
</strong>
</div>


<div className="project-detail-card">
<span>Start Date</span>
<strong>
{selectedProject.startMonth && selectedProject.startYear
? `${selectedProject.startMonth} ${selectedProject.startYear}`
: "N/A"}
</strong>
</div>


<div className="project-detail-card">
<span>Possession</span>
<strong>
{selectedProject.possessionMonth && selectedProject.possessionYear
? `${selectedProject.possessionMonth} ${selectedProject.possessionYear}`
: "N/A"}
</strong>
</div>


<div className="project-detail-card location-card">
<span>Location</span>
<strong>{selectedProject.location || "N/A"}</strong>
</div>


</div>

</div>

</div>

</div>

)}

</section>

)

}

export default Projects