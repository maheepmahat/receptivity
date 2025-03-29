import React from 'react';
import "./Navigation.css";
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import dropdown from '../images/Drag List Down.png';
import { useNavigate } from 'react-router-dom';
import { getMqttClient } from '../mqttconfig'; // Use the shared MQTT client

export default function Navigation() {
  const navigate = useNavigate();
  const [audienceFeedbackChecked, setAudienceFeedbackChecked] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleAudienceFeedbackClick = () => {
    setAudienceFeedbackChecked(!audienceFeedbackChecked);
    const client = getMqttClient(); // Get the singleton MQTT client

    client.on('connect', function () {
      const message = audienceFeedbackChecked ? "hide" : "show";
      const audienceFeedbackTopic = "001/audiencefeedback"; // Unified topic for audience feedback visibility

      client.publish(audienceFeedbackTopic, message, function () {
        console.log(`Message sent to topic ${audienceFeedbackTopic}: ${message}`);
      });
    });

    client.on("error", e => {
      console.error(e.toString());
    });
  };

  const handleExitClick = () => {
    console.log("Exit button clicked by user");
    navigate('/');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(`Dropdown toggled to: ${!isDropdownOpen}`);
  };

  return (
      <Navbar expand="lg" className="bg-body-tertiary container-fluid">
        <div className="d-flex justify-content-start align-items-center">
          {/* Left-aligned content */}
          <Nav.Link onClick={handleExitClick}>
            <span>Exit</span>
          </Nav.Link>
        </div>

        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          {/* Center-aligned content */}
          <Navbar.Brand className="text-center">
            <span className="bold-text">Receptivity Session</span>
          </Navbar.Brand>
        </div>

        <div className="d-flex mb-2">
          {['start'].map((direction) => (
              <DropdownButton
                  key={direction}
                  drop={direction}
                  show={isDropdownOpen}
                  onToggle={handleDropdownToggle}
                  variant="transparent"
                  title={
                    <div>
                      <img
                          src={dropdown}
                          width="30"
                          height="30"
                          className="d-inline-block align-top"
                          alt="Dropdown"
                      />
                    </div>
                  }
              >
                <Dropdown.Item eventKey="1">
                  <label>
                    <input
                        type="checkbox"
                        checked={audienceFeedbackChecked}
                        onChange={handleAudienceFeedbackClick}
                    />
                    Show Audience Feedback
                  </label>
                </Dropdown.Item>
              </DropdownButton>
          ))}
        </div>
      </Navbar>
  );
}
