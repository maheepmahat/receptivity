import React, { useState } from 'react';
import "./Navigation.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../screens/Utility/UserContext';
import { getMqttClient } from '../../MQTT/mqttconfig';

// Default participants to empty array
export default function NavigationUser({ participants = [] }) {
    const [showParticipants, setShowParticipants] = useState(false);
    const { username } = useUser();

    const client = getMqttClient(); // Use the singleton MQTT client
    const navigate = useNavigate();

    // Handle exit button click
    const handleExitClick = () => {
        const clientTopic = "001/client";
        const deleteMessage = `${username}_delete`;

        client.publish(clientTopic, deleteMessage, function () {
            console.log(`Message sent to topic ${clientTopic}: ${deleteMessage}`);
        });

        navigate('/');
        console.log("Exit button clicked");
    };

    // Toggle dropdown visibility
    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary container-fluid p-3">
            <div className="d-flex justify-content-start align-items-center">
                <Nav.Link onClick={handleExitClick} className="me-3">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    {' Exit'}
                </Nav.Link>
            </div>

            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                <Navbar.Brand className="text-center">
                    <span className="bold-text">Receptivity</span>
                </Navbar.Brand>
            </div>

            {/* Participant List Button */}
            <div className="participant-dropdown-container position-relative me-4">
          <span
              className="participant-button px-3 py-2 border rounded shadow-sm bg-white"
              onClick={toggleParticipants}
              style={{ cursor: 'pointer' }}
          >
            Participant List
          </span>
                {showParticipants && (
                    <div
                        className="participants-list-dropdown position-absolute bg-white border rounded p-3 shadow"
                        style={{ top: '120%', right: 0, zIndex: 1000, minWidth: '200px' }}
                    >
                        {/* Display participants */}
                        {participants.length > 0 ? (
                            participants.map((participant, index) => (
                                <div key={index} style={{ color: participant.color, padding: '5px 0' }}>
                                    {participant.name}
                                </div>
                            ))
                        ) : (
                            <div className="text-muted">No participants yet</div>
                        )}
                    </div>
                )}
            </div>
        </Navbar>
    );
}

