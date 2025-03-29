import mqtt from 'mqtt';

const brokerUrl = "ws://receptivity.cs.vt.edu:9001";
const brokerOptions = {
    protocolId: 'MQTT',
    host: 'receptivity.cs.vt.edu',
    port: 9001,
    username: 'rec',
    password: 'eptivity',
};

let mqttClient = null;

function getMqttClient() {
    if (!mqttClient) {
        mqttClient = mqtt.connect(brokerUrl, brokerOptions);

        // Register event handlers
        mqttClient.on('connect', () => {
            console.log('MQTT client connected');
        });

        mqttClient.on('close', () => {
            console.warn('MQTT client connection closed');
        });

        mqttClient.on('error', (error) => {
            console.error('MQTT client error:', error);
        });

        mqttClient.on('offline', () => {
            console.warn('MQTT client is offline');
        });

        mqttClient.on('reconnect', () => {
            console.log('MQTT client reconnecting');
        });
    } else {
        // Ensure client is not in closed state
        if (mqttClient.disconnected) {
            mqttClient.reconnect();
        }
    }

    return mqttClient;
}

// Function to handle publishing messages
function publishMessage(topic, message) {
    const client = getMqttClient();
    if (client && client.connected) {
        client.publish(topic, message, (err) => {
            if (err) {
                console.error(`Failed to publish message to topic ${topic}:`, err);
            } else {
                console.log(`Message published to topic ${topic}:`, message);
            }
        });
    } else {
        console.error('MQTT client not connected. Unable to publish message.');
    }
}

// Function to subscribe to a topic
function subscribeToTopic(topic, messageHandler) {
    const client = getMqttClient();
    if (client) {
        client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to topic ${topic}`);
            } else {
                console.error(`Failed to subscribe to topic ${topic}:`, err);
            }
        });

        // Handle incoming messages for subscribed topics
        client.on('message', (receivedTopic, message) => {
            if (receivedTopic === topic && typeof messageHandler === 'function') {
                messageHandler(message.toString());
            }
        });
    }
}

// Function to unsubscribe from a topic
function unsubscribeFromTopic(topic) {
    const client = getMqttClient();
    if (client) {
        client.unsubscribe(topic, (err) => {
            if (err) {
                console.error(`Failed to unsubscribe from topic ${topic}:`, err);
            } else {
                console.log(`Unsubscribed from topic ${topic}`);
            }
        });
    }
}

export { getMqttClient, publishMessage, subscribeToTopic, unsubscribeFromTopic };
