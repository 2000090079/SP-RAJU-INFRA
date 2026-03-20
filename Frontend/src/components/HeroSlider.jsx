import { useState, useEffect } from "react"

function HeroSlider(){

const images = [
"/images/logo.png",
"/images/dhanush emperor.jpg",
"/images/dhanush enclave.jpg",
"/images/dhanush residency.jpg",
"/images/sai apartments.png",
"/images/sai dhanush.jpg",
"/images/sai dhanush Enclave.jpg",
"/images/sai residency 1.jpg",
"/images/sai residency 2.jpg",
"/images/sai residency 3.jpg",
"/images/sai residency 4.jpg",
"/images/sai residency 5.jpg",
"/images/sai residency 6.jpg",
"/images/sai residency.jpg",
"/images/sai swarla.png",
"/images/sp raju grand.jpg",
"/images/sp raju greens.jpg"
]

const [current,setCurrent] = useState(0)

/* SLIDE FUNCTIONS */
const nextSlide = () =>{
setCurrent((prev)=>(prev+1)%images.length)
}

const prevSlide = () =>{
setCurrent((prev)=>(prev-1+images.length)%images.length)
}

/* AUTO SLIDE */
useEffect(()=>{

const interval = setInterval(()=>{
setCurrent(prev=>(prev+1)%images.length)
},4000)   // ⬅️ slower for smoothness

return ()=>clearInterval(interval)

},[])

/* TOUCH SWIPE (MOBILE) */
let startX = 0

const handleTouchStart = (e) => {
startX = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
const endX = e.changedTouches[0].clientX

if (startX - endX > 50) {
nextSlide()
}

if (endX - startX > 50) {
prevSlide()
}
}

return(

<section className="hero">

<div
className="slideshow"
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
>

{images.map((img,index)=>(

<img
key={index}
src={img}
loading="lazy"   // ⬅️ performance boost
className={`slide ${index===current?"active":""}`}
alt="Construction"
/>

))}

<button className="arrow left" onClick={prevSlide}>❮</button>
<button className="arrow right" onClick={nextSlide}>❯</button>

<div className="dots">

{images.map((_,index)=>(

<span
key={index}
className={`dot ${index===current?"active":""}`}
onClick={()=>setCurrent(index)}
></span>

))}

</div>

</div>

</section>

)

}

export default HeroSlider