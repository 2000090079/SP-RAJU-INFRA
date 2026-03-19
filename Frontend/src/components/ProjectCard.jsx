function ProjectCard({project}){

return(

<div className={`project-card ${project.status}`}>

<img
src={project.image}
alt={project.title}
loading="lazy"
/>

<h3>{project.title}</h3>

<p>{project.description}</p>

<span className={`status ${project.status}`}>
{project.status}
</span>

</div>

)

}

export default ProjectCard
