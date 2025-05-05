import React, { useEffect } from 'react';
import "./Navigation.css";
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import dropdown from '../images/Drag List Down.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../screens/UserContext';
import { getMqttClient } from '../mqttconfig';

export default function NavigationUser(props) {
  const [groupFeedbackVisible, setGroupFeedbackVisible] = React.useState(true);
  const [groupFeedbackChecked, setGroupFeedbackChecked] = React.useState(false);
  const [anonymizeResponseChecked, setAnonymizeResponseChecked] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { username } = useUser();

  const client = getMqttClient(); // Use the singleton MQTT client
  const navigate = useNavigate();

  const handleExitClick = () => {
    // MQTT part of exit function
    const clientTopic = "001/client";
    const deleteMessage = `${username}_delete`;

    client.publish(clientTopic, deleteMessage, function () {
      console.log(`Message sent to topic ${clientTopic}: ${deleteMessage}`);
    });

    navigate('/');
    console.log("Exit button clicked");
  };

  const handleParticipantClick = () => {
    console.log("Participant List clicked");
    navigate("/participantsaudience");
  };

  const handleAnonymizeResponseCheckbox = () => {
    setAnonymizeResponseChecked(!anonymizeResponseChecked);
    if (anonymizeResponseChecked) {
      // If checked, revert the divider color to the user's feedback color
      const selectedColor = props.data.find(item => item.color === props.dividerColor);
      if (selectedColor) {
        console.log("Anonymize unchecked, reverting color ", selectedColor.color);
        props.handleDividerColorChange(selectedColor.color);
      }
    } else {
      // If unchecked, change the divider color to grey
      console.log("Anonymize checked, setting color to grey");
      props.handleDividerColorChange("#484846");
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(`Dropdown toggled to: ${!isDropdownOpen}`);
  };

  const handleGroupFeedbackCheckbox = () => {
    setGroupFeedbackChecked(!groupFeedbackChecked);
    console.log(`Group Feedback checkbox toggled to: ${!groupFeedbackChecked}`);
    props.setCompareBarVisibility(!groupFeedbackChecked);
  };

  // Managing MQTT Subscription for '001/hideaudiencefeedback'
  useEffect(() => {
    const hideAudienceFeedbackTopic = "001/hideaudiencefeedback";

    // Subscribe to the topic if the client is connected
    // if (client.connected) {
    //   client.subscribe(hideAudienceFeedbackTopic, function (err) {
    //     if (!err) {
    //       console.log(`Subscribed to ${hideAudienceFeedbackTopic}`);
    //     }
    //   });
    // } else {
    //   // Handle when the client connects later
    //   const handleConnect = () => {
    //     client.subscribe(hideAudienceFeedbackTopic, function (err) {
    //       if (!err) {
    //         console.log(`Subscribed to ${hideAudienceFeedbackTopic}`);
    //       }
    //     });
    //   };
    //   client.on('connect', handleConnect);
    // }

    // Handle incoming messages
    const handleMessage = (topic, message) => {
      if (topic === hideAudienceFeedbackTopic) {
        const receivedMessage = message.toString();
        setGroupFeedbackVisible(receivedMessage === 'show');
        console.log(`Received message from ${topic}: ${receivedMessage}`);
      }
    };

    client.on('message', handleMessage);

    return () => {
      // Cleanup subscription on component unmount
      if (client.connected) {
        client.unsubscribe(hideAudienceFeedbackTopic, () => {
          console.log(`Unsubscribed from ${hideAudienceFeedbackTopic}`);
        });
      }
      client.removeListener('message', handleMessage);
    };
  }, [client]);

  return (
    <Navbar expand="lg" className="container-fluid" style={{ backgroundColor: '#8EA7E9' }}>
        <div className="d-flex justify-content-start align-items-center">
          <Nav.Link onClick={handleExitClick}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {' Exit'}
          </Nav.Link>
        </div>

        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <Navbar.Brand className="text-center">
            <span className="bold-text">Receptivity</span>

          </Navbar.Brand>
        </div>

        <div className="d-flex mb-2">
          {['start'].map(
              (direction) => (
                  // Added condition to render only if groupFeedbackVisible is true
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
                    {groupFeedbackVisible ? (
                        <Dropdown.Item eventKey="1">
                          <label>
                            <input
                                type="checkbox"
                                checked={groupFeedbackChecked}
                                onChange={handleGroupFeedbackCheckbox}
                            />
                            Group Feedback
                          </label>
                        </Dropdown.Item>
                    ) : null}
                    <Dropdown.Item eventKey="2" onClick={handleParticipantClick}>Participant List</Dropdown.Item>
                    <Dropdown.Item eventKey="3">
                      <label>
                        <input
                            type="checkbox"
                            checked={anonymizeResponseChecked}
                            onChange={handleAnonymizeResponseCheckbox}
                        />
                        Anonymize my Response
                      </label>
                    </Dropdown.Item>
                  </DropdownButton>
              ),
          )}
        </div>
      </Navbar>
  );
}


// import React from 'react';
// import "./Navigation.css";
// import Navbar from 'react-bootstrap/Navbar';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';
// import Nav from 'react-bootstrap/Nav';
// import dropdown from '../images/Drag List Down.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { useUser } from '../screens/UserContext';
// import mqtt from "mqtt";
// import { brokerOptions, brokerUrl } from '../mqttconfig';
//
//
//
// export default function NavigationUser(props) {
//   const [groupFeedbackVisible, setGroupFeedbackVisible] = React.useState(true);
//   const [groupFeedbackChecked, setGroupFeedbackChecked] = React.useState(false);
//   const [anonymizeResponseChecked, setAnonymizeResponseChecked] = React.useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
//   const { username } = useUser();
//
//   // MQTT connection
//   // const brokerUrl = "ws://receptivity.cs.vt.edu:9001";
//   // const brokerOptions = {
//   //   protocolId: 'MQTT',
//   //   host: 'receptivity.cs.vt.edu',
//   //   port: 9001,
//   //   username: 'rec',
//   //   password: 'eptivity'
//   // };
//
//
//   const navigate = useNavigate();
//
//   const handleExitClick = () => {
//     // MQTT part of exit function
//     const client = mqtt.connect(brokerUrl, brokerOptions);
//     const clientTopic = "001/client";
//     const deleteMessage = `${username}_delete`;
//     client.on('connect', function () {
//       console.log("Connected successfully to broker");
//       client.publish(clientTopic, deleteMessage, function () {
//         console.log(`Message sent to topic ${clientTopic}: ${deleteMessage}`);
//         client.end();
//       });
//     });
//     client.on('error', function (error) {
//       console.error("Connection error:", error);
//     });
//
//     client.on('offline', function () {
//       console.log("MQTT client is offline");
//     });
//     // Navigate to the JoinHost screen when Exit is clicked
//     console.log("Exit button clicked");
//     navigate('/');
//   };
//
//   const handleParticipantClick = () => {
//     console.log("Participant List clicked");
//     navigate("/participantsaudience");
//   };
//
//   const handleAnonymizeResponseCheckbox = () => {
//     setAnonymizeResponseChecked(!anonymizeResponseChecked);
//     if (anonymizeResponseChecked) {
//       // If checked, revert the divider color to the user's feedback color
//       const selectedColor = props.data.find(item => item.color === props.dividerColor);
//       if (selectedColor) {
//         console.log("Anonymize unchecked, reverting color ", selectedColor.color);
//         props.handleDividerColorChange(selectedColor.color);
//       }
//     } else {
//       // If unchecked, change the divider color to grey
//       console.log("Anonymize checked, setting color to grey");
//       props.handleDividerColorChange("#484846");
//     }
//   };
//
//   const handleDropdownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     console.log(`Dropdown toggled to: ${!isDropdownOpen}`);
//   };
//
//   const handleGroupFeedbackCheckbox = () => {
//     setGroupFeedbackChecked(!groupFeedbackChecked);
//     console.log(`Group Feedback checkbox toggled to: ${!groupFeedbackChecked}`);
//     // Call the setCompareBarVisibility function based on the checkbox
//     props.setCompareBarVisibility(!groupFeedbackChecked);
//   };
//
//   // Receiving messages from the topic "001/hideaudiencefeedback" to toggle accordingly
//   React.useEffect(() => {
//     const client = mqtt.connect(brokerUrl, brokerOptions);
//
//     client.on('connect', function () {
//       const hideAudienceFeedbackTopic = "001/hideaudiencefeedback";
//       client.subscribe(hideAudienceFeedbackTopic, function (err) {
//         if (!err) {
//           console.log(`Subscribed to ${hideAudienceFeedbackTopic}`);
//         }
//       });
//     });
//
//     client.on('message', function (topic, message) {
//       const receivedMessage = message.toString();
//       setGroupFeedbackVisible(receivedMessage === 'show');
//       console.log(`Received message from ${topic}: ${receivedMessage}`);
//     });
//
//     return () => {
//       if (client) {
//         console.log("Unsubscribed from 001/hideaudiencefeedback");
//         client.unsubscribe("001/hideaudiencefeedback");
//         client.end();
//       }
//     };
//   }, []);
//
//   return (
//       <Navbar expand="lg" className="bg-body-tertiary container-fluid">
//         <div className="d-flex justify-content-start align-items-center">
//           <Nav.Link onClick={handleExitClick}>
//             <FontAwesomeIcon icon={faSignOutAlt} />
//             {' Exit'}
//           </Nav.Link>
//         </div>
//
//         <div className="d-flex justify-content-center align-items-center flex-grow-1">
//           <Navbar.Brand className="text-center">
//             <span className="bold-text">Lecture Mode</span>
//             <h6>Audience View</h6>
//           </Navbar.Brand>
//         </div>
//
//         <div className="d-flex mb-2">
//           {['start'].map(
//               (direction) => (
//                   // Added condition to render only if groupFeedbackVisible is true
//                   <DropdownButton
//                       key={direction}
//                       drop={direction}
//                       show={isDropdownOpen}
//                       onToggle={handleDropdownToggle}
//                       variant="transparent"
//                       title={
//                         <div>
//                           <img
//                               src={dropdown}
//                               width="30"
//                               height="30"
//                               className="d-inline-block align-top"
//                               alt="Dropdown"
//                           />
//                         </div>
//                       }
//                   >
//                     {groupFeedbackVisible ? (
//                         <Dropdown.Item eventKey="1">
//                           <label>
//                             <input
//                                 type="checkbox"
//                                 checked={groupFeedbackChecked}
//                                 onChange={handleGroupFeedbackCheckbox}
//                             />
//                             Group Feedback
//                           </label>
//                         </Dropdown.Item>
//                     ) : null}
//                     <Dropdown.Item eventKey="2" onClick={handleParticipantClick}>Participant List</Dropdown.Item>
//                     <Dropdown.Item eventKey="3">
//                       <label>
//                         <input
//                             type="checkbox"
//                             checked={anonymizeResponseChecked}
//                             onChange={handleAnonymizeResponseCheckbox}
//                         />
//                         Anonymize my Response
//                       </label>
//                     </Dropdown.Item>
//                   </DropdownButton>
//               ),
//           )}
//         </div>
//       </Navbar>
//   );
// }
