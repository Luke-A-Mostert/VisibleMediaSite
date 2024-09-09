import "./styles/Footer.css";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-item">
        <EmailIcon />
        <a href="mailto:Visible_Media@yahoo.com" className="contact-link">
          Visible_Media@yahoo.com
        </a>
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
