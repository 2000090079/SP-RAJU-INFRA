import { useEffect, useState } from "react";

function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav">
        <img src="/images/sprajulogo.png" className="logo" alt="SP Raju Infra" />

        <nav className="nav-links">
          <a href="#about">About</a>

          <span className="nav-separator"></span>

          <a href="#projects">Projects</a>

          <span className="nav-separator"></span>

          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;