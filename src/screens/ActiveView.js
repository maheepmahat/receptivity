import React, { useEffect, useState } from 'react';
import "./ActiveViewHost.css";
import NavigationUser from '../components/NavigationUser';
import FeedbackOption from "../components/FeedbackOption";
import BlinkingAlert from '../components/BlinkingAlert';
import fast_forward from "../images/fast_forward.png";
import pause from "../images/pause.png";
import play from "../images/play.png";
import CompareBar from "../components/CompareBar";
import PreferenceButton from "../components/PreferenceButton";
import { getMqttClient } from '../mqttconfig';
import {
    BtnContainer,
    FeedbackContainer,
    MainContainer,
    PreferenceContainer,
    TopDivider,
} from "../screens/ActiveViewHostStyles";
import { useSession } from './SessionContext';
import { logEvent } from './logUtils';


export default function ActiveView() {
    const [dividerColor, setDividerColor] = useState('#484846');
    const [showCompareBar, setShowCompareBar] = useState(true);
    const [showBlinkingAlert, setShowBlinkingAlert] = useState(false);
    const [clientFeedbackMap, setClientFeedbackMap] = useState({});
    const [username, setUsername] = useState(null);

    const { sessionID } = useSession();
    const client = getMqttClient();


    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            console.log(`Username loaded from sessionStorage: ${storedUsername}`);

            // Add user to the client feedback map immediately as gray
            setClientFeedbackMap((prevMap) => {
                const updatedMap = { ...prevMap };
                updatedMap[storedUsername] = "clear"; // Gray by default
                return updatedMap;
            });

            // Publish initial "clear" status to MQTT
            const topic = sessionID;
            const message = `${storedUsername}_clear_${new Date().toISOString()}`;

            client.publish(topic, message, (err) => {
                if (err) {
                    console.error(`Failed to publish initial status for ${storedUsername}`, err);
                } else {
                    console.log(`Published initial status for ${storedUsername}: ${message}`);
                }
            });
        } else {
            console.warn("No username found in sessionStorage.");
        }
    }, [sessionID]);

    



    const [data, setData] = useState([
        {
            _id: 1,
            label: "Just listen quietly please",
            count: 0,
            color: "#DF1616",
            icon: pause,
        },
        {
            _id: 2,
            label: "Find common ground",
            count: 0,
            color: "#F0DB1C",
            icon: play,
        },
        {
            _id: 3,
            label: "Feel free to Argue",
            count: 0,
            color: "#35DE83",
            icon: fast_forward,
        },
    ]);

    const buttons = [
        {
            label: "How Receptive are you feeling right now?",
            func: function () {
                const topic = sessionID; // Use the session-specific topic
                const message = JSON.stringify({ type: "pollfeedback" });

                client.publish(topic, message, function () {
                    console.log(`Poll feedback message sent to topic ${topic}: ${message}`);
                });
            },
        },
        {
            label: "Clear my Feedback",
            func: function () {
                console.log("Clear My Feedback Button");

                const topic = sessionID;
                const message = `${username}_clear_${new Date().toISOString()}`;

                client.publish(topic, message, function () {
                    console.log(`Message sent to topic ${topic}: ${message}`);
                });

                // Locally update the divider color to gray
                setDividerColor('#484846');
            },
        },
    ];



    const updateCountsAndTotalUsers = (updatedFeedbackMap) => {
        let countR = 0, countY = 0, countG = 0;

        // Calculate the counts for each color
        Object.values(updatedFeedbackMap).forEach((value) => {
            switch (value) {
                case 'R':
                    countR++;
                    break;
                case 'Y':
                    countY++;
                    break;
                case 'G':
                    countG++;
                    break;
                default:
                    break;
            }
        });

        // Update the state with new counts
        setData((prevData) =>
            prevData.map((element) => {
                let updatedCount = 0;
                switch (element.color) {
                    case "#DF1616": // Red
                        updatedCount = countR;
                        break;
                    case "#F0DB1C": // Yellow
                        updatedCount = countY;
                        break;
                    case "#35DE83": // Green
                        updatedCount = countG;
                        break;
                    default:
                        break;
                }
                return { ...element, count: updatedCount };
            })
        );

        console.log(`Counts updated - Red: ${countR}, Yellow: ${countY}, Green: ${countG}`);

        // Broadcast the updated counts to all users
        const stateMessage = JSON.stringify({ countR, countY, countG });
        client.publish(sessionID, stateMessage, (err) => {
            if (err) {
                console.error(`Failed to broadcast state to topic ${sessionID}:`, err);
            } else {
                console.log(`Broadcasted state to topic ${sessionID}: ${stateMessage}`);
            }
        });
    };


    // Transform clientFeedbackMap into participants array
    const participants = Object.keys(clientFeedbackMap).map((key) => {
        const colorCode = clientFeedbackMap[key] === 'R' ? '#DF1616' :
            clientFeedbackMap[key] === 'Y' ? '#F0DB1C' :
                clientFeedbackMap[key] === 'G' ? '#35DE83' :
                    '#484846'; // Default gray for 'clear'

        return { name: key, color: colorCode };
    });



    // Function to handle incoming client feedback messages
    const handleClientFeedback = React.useCallback(() => {
        const clientTopic = sessionID;

        // Subscribe to client feedback topic
        client.subscribe(clientTopic, (err) => {
            if (!err) {
                console.log(`Subscribed to MQTT topic: ${clientTopic}`);
            } else {
                console.error(`Failed to subscribe to MQTT topic: ${clientTopic}`, err);
            }
        });

        client.on('message', (topic, message) => {
            if (topic === clientTopic) {
                const receivedMessage = message.toString();
                const timestamp = new Date().toISOString();
                console.log(`Received client feedback message: ${receivedMessage}`);

                // Log the received message
                logEvent({ timestamp, topic, message: receivedMessage, action: "receive_feedback" });

                // Handle the message (as JSON or feedback)
                try {
                    const parsedMessage = JSON.parse(receivedMessage);

                    if (parsedMessage.type === "pollfeedback") {
                        console.log("Poll feedback message received. Triggering blinking alert.");
                        setShowBlinkingAlert(true); // Show the blinking alert
                        return;
                    }

                    if (parsedMessage.countR !== undefined && parsedMessage.countY !== undefined && parsedMessage.countG !== undefined) {
                        console.log(`Received state update: Red=${parsedMessage.countR}, Yellow=${parsedMessage.countY}, Green=${parsedMessage.countG}`);
                        setData((prevData) =>
                            prevData.map((element) => {
                                let updatedCount = 0;
                                switch (element.color) {
                                    case "#DF1616":
                                        updatedCount = parsedMessage.countR;
                                        break;
                                    case "#F0DB1C":
                                        updatedCount = parsedMessage.countY;
                                        break;
                                    case "#35DE83":
                                        updatedCount = parsedMessage.countG;
                                        break;
                                    default:
                                        break;
                                }
                                return { ...element, count: updatedCount };
                            })
                        );
                        return;
                    }
                } catch (err) {
                    console.warn("Message is not JSON, treating it as individual feedback.");
                }

                const [receivedUsername, value] = receivedMessage.split('_');
                if (!receivedUsername || !value) {
                    console.warn(`Invalid feedback message format: ${receivedMessage}`);
                    return;
                }

                setClientFeedbackMap((prevMap) => {
                    const updatedMap = { ...prevMap };


                    if (value === "clear") {
                        console.log(`Clearing feedback for user: ${receivedUsername}`);
                        updatedMap[receivedUsername] = "clear"; // Set to 'clear' instead of deleting
                    } else {

                    //     if (value === "clear") {
                    //     if (updatedMap.hasOwnProperty(receivedUsername)) {
                    //         console.log(`Clearing feedback for user: ${receivedUsername}`);
                    //         delete updatedMap[receivedUsername];
                    //     }
                    // } else {
                        console.log(`Updating feedback for user: ${receivedUsername} to ${value}`);
                        updatedMap[receivedUsername] = value;
                    }

                    updateCountsAndTotalUsers(updatedMap);
                    return updatedMap;
                });
            } else {
                console.warn(`Received message from unknown topic: ${topic}`);
            }
        });



        }, [client, sessionID]);

    useEffect(() => {
        if (sessionID) {
            console.log(sessionID, 'Session ID is now available');
            handleClientFeedback();
        } else {
            console.log('Session ID is not available yet');
        }

        return () => {
            // Cleanup subscriptions when the component is unmounted
            if (sessionID) {
                client.unsubscribe(sessionID);
            }
            client.removeAllListeners('message');
        };
    }, [sessionID, handleClientFeedback]);

    // Function to change poll count and publish the updated value
    const changePollCount = (_id, color) => {
        if (!username) {
            console.error("Username is null or not set!");
            alert("Please set a username before providing feedback.");
            return;
        }

        const topic = sessionID;
        const timestamp = new Date().toISOString();
        let message = "";

        switch (_id) {
            case 1:
                message = `${username}_R_${timestamp}`;
                break;
            case 2:
                message = `${username}_Y_${timestamp}`;
                break;
            case 3:
                message = `${username}_G_${timestamp}`;
                break;
            default:
                message = '';
        }

        client.publish(topic, message, function () {
            console.log(`Message sent to topic ${topic}: ${message}`);
        });

        // Log the event without color information
        logEvent({
            username: username,
            action: "send_feedback",
            timestamp: timestamp,
        });

        setDividerColor(color);

    };


    return (
        <MainContainer className="MainContainer">
            <NavigationUser
                participants={participants} // Pass the transformed participants list
                setCompareBarVisibility={setShowCompareBar}
                handleDividerColorChange={setDividerColor}
                data={data}
                dividerColor={dividerColor}
            />

            <FeedbackContainer className="FeedbackContainer">
                <h2>My Feedback</h2>
                <TopDivider className="TopDivider" style={{ backgroundColor: dividerColor }} />

                <BtnContainer>
                    {data.map((element) => (
                        <FeedbackOption
                            key={element._id}
                            btnProperty={element}
                            func={() => changePollCount(element._id, element.color)}
                        />
                    ))}
                </BtnContainer>

                {showBlinkingAlert && (
                    <BlinkingAlert
                        text="Please immediately provide feedback"
                        borderColor="blue"
                        onClose={() => setShowBlinkingAlert(false)}
                    />
                )}

                {showCompareBar && (
                    <>
                        <CompareBar colors={data} />
                        <h2>Group feedback</h2>
                    </>
                )}
            </FeedbackContainer>

            <PreferenceContainer>
                {buttons.map((button, _id) => (
                    <PreferenceButton
                        key={_id}
                        className="lectureButton"
                        func={button.func}
                        label={button.label}
                    />
                ))}
            </PreferenceContainer>
        </MainContainer>
    );
}


