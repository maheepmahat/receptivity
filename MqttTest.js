// const mqtt = require('mqtt');
//
// const brokerUrl = 'wss://receptivity.cs.vt.edu:9001';
// const brokerOptions = {
//     username: 'rec',  // Your MQTT broker username
//     password: 'eptivity',  // Your MQTT broker password
// };
//
// const client = mqtt.connect(brokerUrl, brokerOptions);
//
// client.on('connect', () => {
//     console.log("Connected successfully to MQTT broker");
//
//     // Subscribe to a test topic to confirm if the connection works
//     client.subscribe('test/topic', (err) => {
//         if (!err) {
//             console.log("Subscribed to test/topic successfully");
//             client.publish('test/topic', 'Hello from MQTT client', (err) => {
//                 if (!err) {
//                     console.log("Message sent successfully");
//                 } else {
//                     console.error("Failed to publish:", err);
//                 }
//             });
//         } else {
//             console.error("Failed to subscribe:", err);
//         }
//     });
// });
//
// client.on('message', (topic, message) => {
//     console.log(`Message received on ${topic}: ${message.toString()}`);
// });
//
// client.on('error', (error) => {
//     console.error("Connection error:", error);
// });
//
// client.on('offline', () => {
//     console.log("MQTT client is offline");
// });
//
// client.on('reconnect', () => {
//     console.log("Attempting to reconnect...");
// });
