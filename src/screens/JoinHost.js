import React, { useState } from 'react';
import "./JoinHost.css";
import receptivitylogo from "../images/receptivitylogo.png";
import joinsession from "../images/Frame 78.png";
import ModalJoinHost from '../components/ModalJoinHost'; // Ensure this file is correctly imported
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function JoinHost() {
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setModalShow(true); // Opens the modal
  };

  const closeModal = () => {
    setModalShow(false); // Closes the modal
  };

  const handleViewChange = () => {
    navigate('/active'); // Navigate to active view
  };

  const openHelpPDF = () => {
    const helpPDFUrl = "/pdf-file/how-to-use-receptivity.pdf"; // Update with actual PDF path
    window.open(helpPDFUrl, "_blank");
  };

  return (
      <div className='JoinHost'>
        <Container className="d-flex flex-column align-items-center justify-content-center">
          {/* Logo and Title */}
          <div style={{ justifyContent: 'center', alignItems: 'center', gap: 6, display: 'inline-flex', height: 300 }}>
            <img style={{ width: 67.44, height: 60.07 }} alt="receptivitylogo" src={receptivitylogo} />
            <div style={{ textAlign: 'center', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: '700', lineHeight: 36, }}>ECEPTIVITY</div>
          </div>

          {/* Join Session Button */}
          <button
              onClick={openModal} // Opens the modal
              style={{
                border: "none",
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                marginBottom: "20px",
              }}
          >
            <img
                style={{ width: 154, height: 138 }}
                alt="joinsessionlogo"
                src={joinsession}
            />
            <div style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "black",
              marginTop: "10px",
            }}>
              Join Session
            </div>
          </button>

          {/* How to Use Receptivity Button */}
          <button
              onClick={openHelpPDF} // Opens the PDF in a new tab
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                width: "154px",
                height: "138px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: "10px",
              }}
          >
            <span
                style={{
                  fontSize: "100px", // Large question mark
                  color: "black",
                  fontWeight: "bold",
                }}
            >
              ?
            </span>
          </button>
          <div style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold", color: "black", marginTop: "10px" }}>
            How to use Receptivity?
          </div>
        </Container>

        {/* Modal for Join Session */}
        <ModalJoinHost
            show={modalShow} // Controlled by state
            onHide={closeModal} // Closes the modal
            handleViewChange={handleViewChange} // Handles navigation from the modal
        />
      </div>
  );
}
