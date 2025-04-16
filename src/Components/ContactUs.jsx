import React, { useState } from "react";
import "../Styles/ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can integrate with email API (e.g., EmailJS, Formspree) here
    alert("Thanks for reaching out! We'll get back to you soon. 🚀");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1>📬 Contact Us</h1>
      <p className="contact-subtext">
        Have feedback, questions, or creative ideas? We're just a message away!
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          👤 Name:
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          📧 Email:
          <input
            type="email"
            name="email"
            placeholder="***@***.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          💬 Message:
          <textarea
            name="message"
            placeholder="Enter your message here..."
            required
            rows="5"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </label>

        <button type="submit">Send Message 🚀</button>
      </form>

      <div className="contact-info">
        <h3>📞 Other Ways to Reach Us</h3>
        <p>✉️ <strong>Email:</strong> <a href="mailto:support@unisphere.app">UniSphere-Team@gmail.com</a></p>
        <p>🌐 <strong>Website:</strong> <a href="https://unisphere.app">www.unisphere.app</a></p>
        <p>💡 <strong>Ideas & Collaboration:</strong>  <a href="mailto:support@unisphere.app">vibes@unisphere.app</a></p>
      </div>
    </div>
  );
};

export default ContactUs;
