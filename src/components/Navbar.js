import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const handleResize = () => {
    if (window.innerWidth > 600) {
      setOpenLinks(false); // Reset the menuOpen state when screen size is greater than 600px
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <Link to="/">
          <img src={Logo} />
        </Link>
        <div className="hiddenLinks">
          <Link to="/">Home</Link>
          <Link to="/faces">Faces</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/faces">Faces</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
