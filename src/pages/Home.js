import { Link } from "react-router-dom";
import Image from "../assets/HomeBKG.jpeg";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home" style={{ backgroundImage: `url(${Image})` }}>
      <div className="headerContainer">
        <h1>Visible Media</h1>
        <p>Check out all of our faces here!</p>
        <Link to="/faces">
          <button>See Faces</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
