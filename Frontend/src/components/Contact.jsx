import React, { useState } from "react";
import "../styles/contact.css";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      alert(data.message);

      // reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (err) {
      console.error(err);
      alert("Error sending enquiry");
    }
  };

  return (
    <section id="contact" className="contact-section">
      <h2 className="section-title">Contact Us</h2>

      <div className="contact-container">

        {/* CONTACT INFO */}
        <div className="contact-info contact-box">
          <h3>Contact Information</h3>
          <p>🏢 <strong>Company:</strong> SP Raju Infra</p>
          <p>📞 <strong>Phone:</strong> +91 8008780207</p>
          <p>✉️ <strong>Email:</strong> sprajuinfra.co@gmail.com</p>
          <p>📍 <strong>Address:</strong> Rajahmundry, Andhra Pradesh</p>
        </div>

        {/* GOOGLE MAP */}
        <div className="contact-map contact-box">
          <h3>Our Location</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.335839088364!2d81.8083386!3d17.007189099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a3c3ea7a174f%3A0x4deae3aa92df5bdf!2sSP%20RAJU%20INFRA%20Head%20office!5e0!3m2!1sen!2sin!4v1773479573238!5m2!1sen!2sin"
            title="SP Raju Infra Head Office"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* ENQUIRY FORM */}
        <div className="contact-form contact-box">
          <h3>Send Enquiry</h3>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="enquiry-btn">
              <span className="btn-text">Send Enquiry</span>
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;