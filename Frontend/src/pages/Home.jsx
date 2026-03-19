import Navbar from "../components/Navbar"
import HeroSlider from "../components/HeroSlider"
import Stats from "../components/Stats"
import About from "../components/About"
import Projects from "../components/Projects"
import Specifications from "../components/Specifications"
import Contact from "../components/Contact"
import Footer from "../components/Footer"

function Home(){

return(

<>

{/* NAVIGATION */}
<Navbar/>

{/* HERO SECTION */}
<HeroSlider/>

{/* STATS + ABOUT BACKGROUND */}
<div className="stats-about-bg">

{/* COMPANY STATS */}
<Stats/>

{/* ABOUT COMPANY */}
<About/>

</div>

{/* PROJECTS */}
<Projects/>

{/* SPECIFICATIONS */}
<Specifications/>

{/* CONTACT SECTION */}
<Contact/>

{/* FOOTER */}
<Footer/>

</>

)

}

export default Home