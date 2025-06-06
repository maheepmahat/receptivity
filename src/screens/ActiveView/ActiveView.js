import React, { useEffect, useState, useCallback } from 'react';
import "./ActiveViewHost.css";
import NavigationUser from '../../components/NavigationUser/NavigationUser';
import FeedbackOption from "../../components/FeedbackOption/FeedbackOption";
import BlinkingAlert from '../../components/BlinkingAlert/BlinkingAlert';
import fast_forward from "../../images/fast_forward.png";
import pause from "../../images/pause.png";
import play from "../../images/play.png";
import CompareBar from "../../components/CompareBar/CompareBar";
import PreferenceButton from "../../components/PreferenceButton/PreferenceButton";
import { getMqttClient } from '../../MQTT/mqttconfig';
import {
    BtnContainer,
    FeedbackContainer,
    MainContainer,
    PreferenceContainer,
} from "./ActiveViewHostStyles";
import { useSession } from '../Utility/SessionContext';
import { logEvent } from '../Utility/logUtils';

const COLOR_CODES = {
    red: '#DF1616',
    yellow: '#F0DB1C',
    green: '#35DE83',
    neutral: '#E5E0FF',
};

const DATA_TEMPLATE = [
    { _id: 1, label: "Just listen quietly please", count: 0, color: COLOR_CODES.red, icon: pause },
    { _id: 2, label: "Find common ground", count: 0, color: COLOR_CODES.yellow, icon: play },
    { _id: 3, label: "Feel free to Argue", count: 0, color: COLOR_CODES.green, icon: fast_forward },
];

export default function ActiveView() {
    const [dividerColor, setDividerColor] = useState(COLOR_CODES.neutral);
    const [selectedColor, setSelectedColor] = useState(""); // To store selected button color
    const [showCompareBar, setShowCompareBar] = useState(true);
    const [showBlinkingAlert, setShowBlinkingAlert] = useState(false);
    const [clientFeedbackMap, setClientFeedbackMap] = useState({});
    const [username, setUsername] = useState(null);

    const { sessionID } = useSession();
    const client = getMqttClient();

    const [data, setData] = useState(DATA_TEMPLATE);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        if (!storedUsername) return;
    
        setUsername(storedUsername);
        setClientFeedbackMap(prev => ({ ...prev, [storedUsername]: "clear" }));
    
        // ✅ Subscribe FIRST
        client.subscribe(sessionID, (err) => {
            if (err) console.error("Subscribe failed:", err);
    
            // ✅ Only after subscribing, publish presence and request
            const message = `${storedUsername}_clear_${new Date().toISOString()}`;
            client.publish(sessionID, message);
    
            const requestMessage = JSON.stringify({ type: "request_participant_list" });
            client.publish(sessionID, requestMessage);
        });
    }, [sessionID, client]);
    
    

    const updateCountsAndTotalUsers = useCallback((feedbackMap) => {
        console.log("Feedback map:", feedbackMap);
        const counts = { R: 0, Y: 0, G: 0 };
        Object.values(feedbackMap).forEach(val => {
            if (counts[val] !== undefined) counts[val]++;
        });
        console.log("Counts:", counts);
        setData(DATA_TEMPLATE.map(entry => ({
            ...entry,
            count:
                entry.color === COLOR_CODES.red ? counts.R :
                entry.color === COLOR_CODES.yellow ? counts.Y :
                entry.color === COLOR_CODES.green ? counts.G : 0,
        })));

        const stateMessage = JSON.stringify({
            countR: counts.R,
            countY: counts.Y,
            countG: counts.G
        });

        client.publish(sessionID, stateMessage, (err) => {
            if (err) console.error(`Failed to broadcast state:`, err);
        });
        
    }, [client, sessionID]);

    const participants = Object.entries(clientFeedbackMap).map(([name, val]) => ({
        name,
        color:
            val === 'R' ? COLOR_CODES.red :
            val === 'Y' ? COLOR_CODES.yellow :
            val === 'G' ? COLOR_CODES.green :
            COLOR_CODES.neutral
    }));

    const handleClientFeedback = useCallback(() => {
        const topic = sessionID;

        client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Subscription error:`, err);
            }
        });

        const handleMessage = (t, m) => {
            if (t !== topic) return;

            const msg = m.toString();
            console.log("MQTT message received:", msg);
            const timestamp = new Date().toISOString();
            logEvent({ timestamp, topic, message: msg, action: "receive_feedback" });

            try {
                const parsed = JSON.parse(msg);
                if (parsed.type === "request_participant_list") {
                    // Only respond, don't show blinking alert
                    const myFeedback = clientFeedbackMap[username] || "clear";
                    const timestamp = new Date().toISOString();
                    const response = `${username}_${myFeedback}_${timestamp}`;
                    client.publish(sessionID, response);
                    return;
                }
                
                if (parsed.type === "pollfeedback") {
                    setShowBlinkingAlert(true); // ✅ only trigger here
                    return;
                }                

                if (parsed.countR !== undefined) {
                    setData(DATA_TEMPLATE.map(entry => ({
                        ...entry,
                        count:
                            entry.color === COLOR_CODES.red ? parsed.countR :
                            entry.color === COLOR_CODES.yellow ? parsed.countY :
                            entry.color === COLOR_CODES.green ? parsed.countG : 0,
                    })));
                    return;
                }
            } catch (e) {
                // Not JSON - continue as raw format
            }

            const [user, val] = msg.split('_');
            console.log("Parsed user and value:", user, val);
            if (!user || !val) {
                console.warn(`Invalid message format: ${msg}`);
                return;
            }

            setClientFeedbackMap(prev => {
                const currentVal = prev[user];
                if (currentVal === val) return prev;

                const updated = { ...prev };
                updated[user] = val === "clear" ? "clear" : val;
                console.log("Updated clientFeedbackMap:", updated); 
                updateCountsAndTotalUsers(updated);
                return updated;
            });
        };

        client.on('message', handleMessage);

        return () => {
            client.unsubscribe(topic);
            client.removeListener('message', handleMessage);
        };
    }, [client, sessionID, updateCountsAndTotalUsers, clientFeedbackMap, username]);

    useEffect(() => {
        if (sessionID) {
            return handleClientFeedback();
        }
    }, [sessionID, handleClientFeedback]);

    const changePollCount = (_id, color) => {

        console.log("changePollCount called with _id:", _id, "and color:", color);
        if (!username) {
            alert("Please set a username before providing feedback.");
            return;
        }

        const timestamp = new Date().toISOString();
        const code = _id === 1 ? "R" : _id === 2 ? "Y" : "G";
        const message = `${username}_${code}_${timestamp}`;
        console.log("Publishing message:", message);
        client.publish(sessionID, message, (err) => {
            if (err) console.error("Publish error:", err);
        });

        logEvent({ username, action: "send_feedback", timestamp });
        setDividerColor(color);
        setSelectedColor(color);
    };

    const buttons = [
        {
            label: "How Receptive are you feeling right now?",
            func: () => {
                const message = JSON.stringify({ type: "pollfeedback" });
                client.publish(sessionID, message, (err) => {
                    if (err) console.error("Publish error:", err);
                });
            }
        },
        {
            label: "Clear my Feedback",
            func: () => {
                const message = `${username}_clear_${new Date().toISOString()}`;
                client.publish(sessionID, message, (err) => {
                    if (err) console.error("Publish error:", err);
                });
                setDividerColor(COLOR_CODES.neutral);
                setSelectedColor(COLOR_CODES.neutral);
            }
        }
    ];

    //console.log("data: ", data);
    return (
        <MainContainer className="flex flex-col gap-6 p-6 min-h-screen rounded-2xl shadow-md">
            <NavigationUser
                participants={participants}
                setCompareBarVisibility={setShowCompareBar}
                handleDividerColorChange={setDividerColor}
                data={data}
                dividerColor={dividerColor}
            />
        <br></br>
    <FeedbackContainer
            className="p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: selectedColor }} // Apply selected color here
        >
            <br/>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">My Feedback</h2>
            

            <BtnContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.map((el) => (
                    <FeedbackOption
                        key={el._id}
                        btnProperty={el}
                        func={() => changePollCount(el._id, el.color)}
                    />
                ))}
            </BtnContainer>

            {showBlinkingAlert && (
                <div className="mt-4">
                    <BlinkingAlert
                        text="Please immediately provide feedback"
                        borderColor="blue"
                        onClose={() => setShowBlinkingAlert(false)}
                    />
                </div>
            )}
            <br/><br/> 
            
    </FeedbackContainer>
        <h2 className="text-lg font-medium text-gray-700 mt-4">Group Feedback</h2>

        {showCompareBar && (
                <div className="mt-6">
                    <CompareBar colors={data} />
                </div>
            )}
            <PreferenceContainer className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
                {buttons.map((btn, idx) => (
                    <PreferenceButton
                        key={idx}
                        className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                        func={btn.func}
                        label={btn.label}
                    />
                ))}
            </PreferenceContainer>
        </MainContainer>
    );
    
}
