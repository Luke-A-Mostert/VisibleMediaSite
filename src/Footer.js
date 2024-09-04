import "./styles/Footer.css";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-item">
        <Link to="/contact" className="contact-link">
          <EmailIcon />
          <p>Visible_Media@yahoo.com</p>
        </Link>
      </div>
      <div className="footer-item">
        <div className="phone-item">
          <PhoneIcon />
        </div>
        <p>708-534-2525</p>
      </div>
      <p>&copy; 2024 Visible Media</p>
    </div>
  );
};

export default Footer;
