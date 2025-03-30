import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../screens/SessionContext';
import { useUser } from '../screens/UserContext';
import { SESSION_USERNAMES } from '../constants';

const sessionUsernameMap = {
  demo: 'Demo',
  '01': 'Group 1',
  // '02': 'Group 2',
};

function ModalJoin({ show, onHide }) {
  const navigate = useNavigate();
  const { sessionID, setSessionID } = useSession();
  const { username, updateUser } = useUser();

  const handleSessionChange = (e) => setSessionID(e.target.value);

  const validateAndProceed = () => {
    if (!username?.trim()) return alert('Please enter your PID.');
    if (!sessionID) return alert('Please select a valid session ID.');

    const sanitizedUsername = username.trim();

    // Demo session allows any username
    if (sessionID === 'demo') {
      completeSession(sanitizedUsername);
      return;
    }

    const validUsernames = SESSION_USERNAMES[sessionID]?.map((name) => name.toLowerCase()) || [];
    if (!validUsernames.includes(sanitizedUsername.toLowerCase())) {
      return alert('Invalid PID. Please use a valid PID for the selected session.');
    }

    completeSession(sanitizedUsername);
  };

  const completeSession = (username) => {
    sessionStorage.setItem('username', username);
    updateUser(username);
    navigate('/active');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Join a Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Enter Your PID</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => updateUser(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Select Session ID</Form.Label>
          <Form.Control as="select" value={sessionID} onChange={handleSessionChange}>
            <option value="">Select a session</option>
            {Object.entries(sessionUsernameMap).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={validateAndProceed}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalJoin;
