import { useState } from "react"

function Specifications(){

const [openItems,setOpenItems] = useState([])

const toggleItem = (index) => {

if(openItems.includes(index)){
setOpenItems(openItems.filter(i => i !== index))
}else{
setOpenItems([...openItems,index])
}

}

const specs = [

{ title:"STRUCTURE", content:"R.C.C. Framed Structure." },

{ title:"WALLS", content:"External 9 inch thick wall and internal 4½ inch thick wall using 1st class table moulded red bricks in C.M." },

{ title:"PLASTERING", content:"Smooth plastering for external walls and smooth finish plastering for internal walls with lappam finish." },

{ title:"PAINTING", content:"Internal walls with two coat wall care work and interior emulsion paint. Exterior walls with exterior emulsion paint." },

{ title:"FLOORING", content:"All rooms flooring with vitrified tiles 800x800 mm size of RAK / Aparna / CERA or equivalent brands." },

{ title:"DOORS", content:"Main Door: Teak wood frame and shutter with melamine polishing and designer hardware." },

{ title:"WINDOWS", content:"UPVC sliding windows fitted with float glass and mosquito mesh." },

{ title:"CEILING", content:"Plain designed POP ceilings for all rooms except kitchen and toilets." },

{ title:"ELECTRICAL", content:"Concealed copper wiring with modular switches and A/C points for bedrooms." },

{ title:"KITCHEN", content:"Granite kitchen platform and steel sink with ceramic tiled dado above platform." },

{ title:"SANITARY", content:"Branded sanitary fittings with hot and cold water provision." },

{ title:"PLUMBING", content:"CPVC, UPVC & PVC pipes quality fittings Astral / Ashirwad / Finolex." },

{ title:"LIFT", content:"6 Passenger lift of Johnson or KONE standard make will be provided." },

{ title:"GENERATOR", content:"15 kVA generator of Ashok Leyland, Eicher, Greaves, Kirloskar." },

{ title:"PARKING", content:"Every flat will be provided with one car parking." },

{ title:"CCTV CAMERAS", content:"Security purpose CCTV cameras will be installed." }

]

return(

<section className="spec-section">

<h2 className="spec-title">Construction Details</h2>

<div className="spec-grid">

{specs.map((item,index)=>(

<div key={index} className="spec-card">

<div
className="spec-header"
onClick={()=>toggleItem(index)}
>

<span>{item.title}</span>

<span>{openItems.includes(index) ? "−" : "+"}</span>

</div>

{openItems.includes(index) && (

<div className="spec-content">
<p>{item.content}</p>
</div>

)}

</div>

))}

</div>

</section>

)

}

export default Specifications
