import React from "react";
import Image from "../assets/HomeBKG.jpeg";
import "../styles/Contact.css";

function Contact() {
  return (
    <div className="contact">
      <div
        className="leftSide"
        style={{ backgroundImage: `url(${Image})` }}
      ></div>
      <div className="rightSide">
        <h1> Contact Us</h1>

        <form id="contact-form" method="POST">
          <label htmlFor="first">First Name</label>
          <input
            name="first"
            placeholder="Enter first name"
            type="text"
            required
          />
          <label htmlFor="last">Last Name</label>
          <input
            name="last"
            placeholder="Enter last name"
            type="text"
            required
          />
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="Enter email" type="email" required />
          <label htmlFor="message">Message</label>
          <textarea
            rows="6"
            placeholder="Enter message"
            name="message"
            required
          ></textarea>
          <button type="submit"> Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
