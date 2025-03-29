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
import { v4 as uuidv4 } from 'uuid';  // Import UUID for unique identifier

import {
    BtnContainer,
    FeedbackContainer,
    MainContainer,
    PreferenceContainer,
    TopDivider,
} from "../screens/ActiveViewHostStyles";
import { useSession } from './SessionContext';

const USER_NAMES = [
    "user1", "user2", "user3", "user4", "user5",
    "user6", "user7", "user8", "user9", "user10",
    "user11", "user12", "user13", "user14", "user15"
];

export default function ActiveView() {
    const [dividerColor, setDividerColor] = useState('#484846');
    const [showCompareBar, setShowCompareBar] = useState(true);
    const [showBlinkingAlert, setShowBlinkingAlert] = useState(false);
    const [clientFeedbackMap, setClientFeedbackMap] = useState({});

    const { sessionID } = useSession();
    const client = getMqttClient();

    // Assign a unique username to each client
    const [username] = useState(() => {
        // Assign username using the UUID to ensure uniqueness
        return uuidv4(); // Unique identifier for each participant.
    });

    const [data, setData] = useState([
        {
            _id: 1,
            label: "Pause for Questions",
            count: 0,
            color: "#DF1616",
            icon: pause,
        },
        {
            _id: 2,
            label: "Repeat, Slow down, simplify, exemplify",
            count: 0,
            color: "#F0DB1C",
            icon: play,
        },
        {
            _id: 3,
            label: "Okay to Argue",
            count: 0,
            color: "#35DE83",
            icon: fast_forward,
        },
    ]);

    const buttons = [
        {
            label: "How Receptive are you feeling right now?",
            func: function () {
                const topic = "pollfeedback";
                const message = "pollfeedback";

                client.publish(topic, message, function () {
                    console.log(`Message sent to topic ${topic}: ${message}`);
                });
            },
        },
        {
            label: "Clear my Feedback",
            func: function () {
                console.log("Clear My Feedback Button");
                setDividerColor('#484846');

                const topic = sessionID;
                const message = `${username}_clear_${new Date().toISOString()}`;

                client.publish(topic, message, function () {
                    console.log(`Message sent to topic ${topic}: ${message}`);
                });
            },
        },
    ];

    // Function to update counts and total users
    const updateCountsAndTotalUsers = (updatedFeedbackMap) => {
        let countR = 0;
        let countY = 0;
        let countG = 0;

        // Iterate over all feedback values in clientFeedbackMap to count R, Y, G
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
                    case "#DF1616":
                        updatedCount = countR;
                        break;
                    case "#F0DB1C":
                        updatedCount = countY;
                        break;
                    case "#35DE83":
                        updatedCount = countG;
                        break;
                    default:
                        break;
                }
                return { ...element, count: updatedCount };
            })
        );

        // Send updated counts to the audience feedback topic
        const countsMessage = JSON.stringify({ countR, countY, countG });
        const audienceFeedbackTopic = "001/audiencefeedback";

        client.publish(audienceFeedbackTopic, countsMessage, function () {
            console.log(`Counts sent to topic ${audienceFeedbackTopic}: ${countsMessage}`);
        });
    };

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

        // Handle incoming MQTT messages
        client.on('message', (topic, message) => {
            if (topic === clientTopic) {
                const receivedMessage = message.toString();
                console.log(`Received client feedback message: ${receivedMessage}`);

                const [receivedUsername, value, timestamp] = receivedMessage.split('_');

                // Logging message to server (for example purposes, we log to console)
                console.log(`Received at ${timestamp}: User ${receivedUsername} gave feedback: ${value}`);

                setClientFeedbackMap((prevMap) => {
                    const updatedMap = { ...prevMap };
                    if (value === "clear") {
                        if (updatedMap.hasOwnProperty(receivedUsername)) {
                            console.log(`Clearing feedback for user: ${receivedUsername}`);
                            delete updatedMap[receivedUsername];
                        }
                    } else {
                        console.log(`Updating feedback for user: ${receivedUsername} to ${value}`);
                        updatedMap[receivedUsername] = value;
                    }
                    console.log("After updating feedback:", updatedMap);
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
        const topic = sessionID;
        let message = "";

        switch (_id) {
            case 1:
                message = `${username}_R_${new Date().toISOString()}`;
                break;
            case 2:
                message = `${username}_Y_${new Date().toISOString()}`;
                break;
            case 3:
                message = `${username}_G_${new Date().toISOString()}`;
                break;
            default:
                message = '';
        }

        client.publish(topic, message, function () {
            console.log(`Message sent to topic ${topic}: ${message}`);
        });

        setDividerColor(color);
    };

    return (
        <MainContainer className="MainContainer">
            <NavigationUser
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
