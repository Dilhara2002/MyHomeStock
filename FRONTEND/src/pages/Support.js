import React, { useState } from "react";
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaExclamationTriangle,
  FaLightbulb,
  FaQuestionCircle,
  FaUser,
  FaList
} from "react-icons/fa";

const SupportPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [reportForm, setReportForm] = useState({
    type: "bug",
    description: "",
    screenshot: null
  });

  const faqs = [
    {
      question: "How do I add an item to inventory?",
      answer: "Navigate to the Inventory page and click the 'Add Item' button. Fill in the required details and submit the form."
    },
    {
      question: "How does the auto-suggestion work?",
      answer: "Our system learns from your previous entries and suggests similar items as you type to save you time."
    },
    {
      question: "Can multiple users access the same inventory?",
      answer: "Yes, you can share your inventory with family members by inviting them through the 'Share' feature in your account settings."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setReportForm(prev => ({ ...prev, screenshot: e.target.files[0] }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert("Your message has been sent successfully!");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert(`Thank you for your ${reportForm.type} report!`);
    setReportForm({ type: "bug", description: "", screenshot: null });
  };

  return (
    <div className="support-page" style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      padding: "20px 0"
    }}>
      {/* Main Content */}
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
        {/* Support Categories */}
        <section className="mb-5">
          <h2 style={{ 
            color: "#00838F",
            fontWeight: "600",
            marginBottom: "25px",
            borderBottom: "2px solid #e0e0e0",
            paddingBottom: "10px"
          }}>
            Quick Support Links
          </h2>
          <div className="row">
            {[
              { title: "FAQs", icon: <FaQuestionCircle size={24} />, desc: "Common questions about HomeStock" },
              { title: "Contact Us", icon: <FaUser size={24} />, desc: "For direct inquiries" },
              { title: "User Guide", icon: <FaList size={24} />, desc: "Step-by-step instructions" },
              { title: "Report an Issue", icon: <FaExclamationTriangle size={24} />, desc: "Bug reporting form" },
              { title: "Feature Requests", icon: <FaLightbulb size={24} />, desc: "Suggest improvements" }
            ].map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100" style={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s",
                  cursor: "pointer"
                }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                  <div className="card-body text-center" style={{ padding: "25px" }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 auto 15px",
                      background: "linear-gradient(135deg, rgba(0,188,212,0.1) 0%, rgba(0,131,143,0.1) 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#00838F"
                    }}>
                      {item.icon}
                    </div>
                    <h5 style={{ fontWeight: "600", color: "#00838F" }}>{item.title}</h5>
                    <p style={{ color: "#6c757d" }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-5">
          <h2 style={{ 
            color: "#00838F",
            fontWeight: "600",
            marginBottom: "25px",
            borderBottom: "2px solid #e0e0e0",
            paddingBottom: "10px"
          }}>
            Frequently Asked Questions
          </h2>
          <div className="accordion" style={{ borderRadius: "10px", overflow: "hidden" }}>
            {faqs.map((faq, index) => (
              <div key={index} className="accordion-item" style={{ border: "none", marginBottom: "10px" }}>
                <div 
                  className="accordion-header" 
                  onClick={() => toggleFaq(index)}
                  style={{
                    padding: "15px 20px",
                    background: activeFaq === index ? "#f1f9fa" : "white",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0"
                  }}
                >
                  <h5 style={{ margin: 0, fontWeight: "500" }}>{faq.question}</h5>
                  {activeFaq === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {activeFaq === index && (
                  <div className="accordion-body" style={{
                    padding: "20px",
                    background: "#f1f9fa",
                    borderBottom: "1px solid #e0e0e0"
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="mb-5">
          <h2 style={{ 
            color: "#00838F",
            fontWeight: "600",
            marginBottom: "25px",
            borderBottom: "2px solid #e0e0e0",
            paddingBottom: "10px"
          }}>
            Contact Us
          </h2>
          <div className="card" style={{
            borderRadius: "10px",
            border: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}>
            <div className="card-body" style={{ padding: "30px" }}>
              <form onSubmit={handleContactSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ fontWeight: "600" }}>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      style={{
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        padding: "10px 15px",
                        fontSize: "15px"
                      }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ fontWeight: "600" }}>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      style={{
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        padding: "10px 15px",
                        fontSize: "15px"
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: "600" }}>Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      padding: "10px 15px",
                      fontSize: "15px"
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: "600" }}>Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows="5"
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      padding: "10px 15px",
                      fontSize: "15px"
                    }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    borderRadius: "8px",
                    padding: "12px 25px",
                    fontSize: "16px",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 10px rgba(0, 188, 212, 0.3)",
                    transition: "all 0.2s ease"
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Report Issue / Feature Request */}
        <section className="mb-5">
          <h2 style={{ 
            color: "#00838F",
            fontWeight: "600",
            marginBottom: "25px",
            borderBottom: "2px solid #e0e0e0",
            paddingBottom: "10px"
          }}>
            Report an Issue / Feature Request
          </h2>
          <div className="card" style={{
            borderRadius: "10px",
            border: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
          }}>
            <div className="card-body" style={{ padding: "30px" }}>
              <form onSubmit={handleReportSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: "600" }}>Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={reportForm.type}
                    onChange={handleReportChange}
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      padding: "10px 15px",
                      fontSize: "15px"
                    }}
                  >
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: "600" }}>Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={reportForm.description}
                    onChange={handleReportChange}
                    required
                    rows="5"
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      padding: "10px 15px",
                      fontSize: "15px"
                    }}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: "600" }}>Attach Screenshot (optional)</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{
                        borderRadius: "8px",
                        border: "2px solid #e0e0e0",
                        padding: "10px 15px",
                        fontSize: "15px"
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    borderRadius: "8px",
                    padding: "12px 25px",
                    fontSize: "16px",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 10px rgba(0, 188, 212, 0.3)",
                    transition: "all 0.2s ease"
                  }}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Custom CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .support-page {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #00BCD4 !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 188, 212, 0.25) !important;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
          }
        `}
      </style>
    </div>
  );
};

export default SupportPage;