import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../screens/SessionContext';
import { useUser } from '../screens/UserContext';

function ModalJoin(props) {
  const { show, onHide } = props;
  const navigate = useNavigate();
  const { sessionID, setSessionID } = useSession();
  const { username, updateUser } = useUser();

  const sessionUsernameMap = {
    'defaultuser': 'DefaultUser',
    'aansell': 'Demo',
    '01':'Group 1',
    '02':'Group 2',
  };

  const handleSessionChange = (e) => {
    const selectedSessionID = e.target.value;
    setSessionID(selectedSessionID);
  };

  const handleSubmit = () => {
    if (!username) {
      alert('Please enter a username.');
      return;
    }

    if (!sessionID) {
      alert('Please select a valid session ID.');
      return;
    }

    // Update the user state with the entered username
    updateUser(username);

    // Navigate to the unified participant view
    navigate('/active');

    // Close the modal
    onHide();
  };

  return (
      <Modal
          show={show}
          onHide={props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Join a Session
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Enter Your Username</Form.Label>
          <Form.Control
              type="text"
              value={username}
              onChange={(e) => updateUser(e.target.value)}
          />

          <Form.Label>Select Session ID</Form.Label>
          <Form.Control
              as="select"
              value={sessionID}
              onChange={handleSessionChange}
          >
            <option value="">Select a session</option>
            {Object.entries(sessionUsernameMap).map(([sessionID, sessionName]) => (
                <option key={sessionID} value={sessionID}>
                  {sessionName}
                </option>
            ))}
          </Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
  );
}

export default ModalJoin;
