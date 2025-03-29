// const mqtt = require('mqtt');
// const brokerUrl = "wss://iot.cs.vt.edu:9001";
// const brokerOptions = {
//     protocolId: 'MQTT',
//     host: 'iot.cs.vt.edu',
//     port: 9001,
//     username: 'icat',
//     password: 'icat2GO'
// }

// const client = mqtt.connect(brokerUrl, brokerOptions);


// client.on('connect', function () {
//     console.log('Connected to MQTT broker');
//     const topic = 'test/001'; // Replace with your desired topic
//     const message = 'Hello, MQTT!'; // Replace with your message

//     client.subscribe("presence", (err) => {
//         if (!err) {
//             client.publish(topic, message, function () {
//                 console.log(`Message sent to topic ${topic}: ${message}`);
//                 client.end(); // Close the MQTT connection
//             });
//         }
//     });


// });

// client.on("error", e => {
//     console.log(e);
// })

// // When a message is received, log it
// client.on("message", (topic, message) => {
//     console.log(message.toString());
//     client.end(); // Close the connection
// });