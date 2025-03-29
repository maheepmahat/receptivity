import React, { useState } from 'react';
import "./JoinHost.css";
import receptivitylogo from "../images/receptivitylogo.png";
import joinsession from "../images/Frame 78.png";
import Button from 'react-bootstrap/Button';
import ModalJoinHost from '../components/ModalJoinHost';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function JoinHost() {
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setModalShow(true);
  };

  const closeModal = () => {
    setModalShow(false);
  };

  const handleViewChange = () => {
    // Instead of setting a local state, navigate directly to the route
    navigate('/active');
  };

  return (
      <div className='JoinHost'>
        <Container className="d-flex flex-column align-items-center justify-content-center">
          <div style={{ justifyContent: 'center', alignItems: 'center', gap: 6, display: 'inline-flex', height: 300 }}>
            <img style={{ width: 67.44, height: 60.07 }} alt="receptivitylogo" src={receptivitylogo} />
            <div style={{ textAlign: 'center', color: 'black', fontSize: 24, fontFamily: 'Inter', fontWeight: '700', lineHeight: 36, }}>ECEPTIVITY</div>
          </div>
          <Button variant="outline-light" onClick={() => openModal()}>
            <img style={{ width: 154, height: 138 }} alt="joinsessionlogo" src={joinsession} />
            <div className="div">Join Session</div>
          </Button>
        </Container>

        <ModalJoinHost
            show={modalShow}
            onHide={() => closeModal()}
            handleViewChange={handleViewChange}
        />
      </div>
  );
}
