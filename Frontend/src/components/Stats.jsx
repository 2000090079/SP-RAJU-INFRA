function Stats(){

const stats = [

{
number:"25+",
text:"Residential & Commercial Projects Delivered"
},

{
number:"20+",
text:"Years of Industry Experience"
},

{
number:"150000+",
text:"Square Feet Completed"
},

{
number:"20000+",
text:"Square Feet Under Development"
},

{
number:"200K+",
text:"Square Feet Planned"
}

]

return(

<section className="stats">

<h2>Our Impact</h2>

<div className="stats-grid">

{stats.map((item,index)=>(

<div key={index} className="stat-card">

<h3>{item.number}</h3>
<p>{item.text}</p>

</div>

))}

</div>

</section>

)

}

export default Stats

