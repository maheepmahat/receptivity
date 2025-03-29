// import React from 'react';
// import "./ActiveViewHost.css";
// import Navigation from '../components/Navigation';
// import FeedbackOption from "../components/FeedbackOption";
// import fast_forward from "../images/fast_forward.png";
// import pause from "../images/pause.png";
// import play from "../images/play.png";
// import CompareBar from "../components/CompareBar";
// import { useSession } from './SessionContext';
// import { getMqttClient } from '../mqttconfig';
//
// import {
//   BtnContainer,
//   FeedbackContainer,
//   MainContainer,
//   PreferenceContainer,
//   TopDivider,
// } from "../screens/ActiveViewHostStyles";
// import PreferenceButton from "../components/PreferenceButton";
//
// export default function ActiveViewHost() {
//   const [dividerColor, setDividerColor] = React.useState('#484846');
//   const { sessionID } = useSession();
//   const client = getMqttClient(); // Get the singleton MQTT client
//
//   const buttons = [
//     {
//       label: "How Receptive are you feeling right now?",
//       func: function () {
//         const topic = "pollfeedback";
//         const message = "pollfeedback";
//
//         client.publish(topic, message, function () {
//           console.log(`Message sent to topic ${topic}: ${message}`);
//         });
//       },
//     },
//     {
//       label: "Clear my Feedback",
//       func: function () {
//         console.log("Clear My Feedback Button");
//         setDividerColor('#484846');
//
//         const topic = sessionID;
//         const message = "clear";
//
//         client.publish(topic, message, function () {
//           console.log(`Message sent to topic ${topic}: ${message}`);
//         });
//       },
//     },
//   ];
//
//   const [data, setData] = React.useState([
//     {
//       _id: 1,
//       label: "Please Listen Quietly",
//       count: 33,
//       color: "#DF1616",
//       icon: pause,
//     },
//     {
//       _id: 2,
//       label: "Find Common Ground",
//       count: 33,
//       color: "#F0DB1C",
//       icon: play,
//     },
//     {
//       _id: 3,
//       label: "Okay to Argue",
//       count: 33,
//       color: "#35DE83",
//       icon: fast_forward,
//     },
//   ]);
//
//   const clientFeedbackMap = {};
//   let totalUsers = 0;
//   let countR = 0;
//   let countY = 0;
//   let countG = 0;
//
//   // Function to update counts and total users
//   function updateCountsAndTotalUsers() {
//     countR = 0;
//     countY = 0;
//     countG = 0;
//     totalUsers = Object.keys(clientFeedbackMap).length;
//
//     Object.values(clientFeedbackMap).forEach((value) => {
//       switch (value) {
//         case 'R':
//           countR++;
//           break;
//         case 'Y':
//           countY++;
//           break;
//         case 'G':
//           countG++;
//           break;
//         default:
//       }
//     });
//
//     const updatedData = data.map((element) => {
//       let updatedCount = 0;
//       switch (element.color) {
//         case "#DF1616": updatedCount = countR; break;
//         case "#F0DB1C": updatedCount = countY; break;
//         case "#35DE83": updatedCount = countG; break;
//         default:
//       }
//       return { ...element, count: updatedCount };
//     });
//
//     setData(updatedData);
//     console.log("Updated Data Array");
//
//     // Send updated counts to the audience feedback topic
//     const countsMessage = JSON.stringify({ countR, countY, countG });
//     const audienceFeedbackTopic = "001/audiencefeedback";
//
//     client.publish(audienceFeedbackTopic, countsMessage, function () {
//       console.log(`Counts sent to topic ${audienceFeedbackTopic}: ${countsMessage}`);
//     });
//   }
//
//   // Function to handle incoming client feedback messages
//   function handleClientFeedback() {
//     const clientTopic = sessionID;
//
//     // Subscribe to client feedback topic
//     client.subscribe(clientTopic, (err) => {
//       if (!err) {
//         console.log(`Subscribed to MQTT topic: ${clientTopic}`);
//       }
//     });
//
//     // Handle incoming MQTT messages
//     client.on('message', (topic, message) => {
//       if (topic === clientTopic) {
//         const receivedMessage = message.toString();
//         console.log(`Received client feedback message: ${receivedMessage}`);
//
//         const [receivedUsername, value] = receivedMessage.split('_');
//
//         if (value === "delete") {
//           if (clientFeedbackMap.hasOwnProperty(receivedUsername)) {
//             delete clientFeedbackMap[receivedUsername];
//             updateCountsAndTotalUsers();
//             console.log(JSON.stringify(clientFeedbackMap));
//           }
//         } else {
//           if (clientFeedbackMap[receivedUsername] !== value) {
//             clientFeedbackMap[receivedUsername] = value;
//             updateCountsAndTotalUsers();
//             console.log(JSON.stringify(clientFeedbackMap));
//           }
//         }
//       }
//     });
//   }
//
//   React.useEffect(() => {
//     if (sessionID) {
//       console.log(sessionID, 'Session ID is now available');
//       handleClientFeedback();
//     } else {
//       console.log('Session ID is not available yet');
//     }
//
//     return () => {
//       // Cleanup subscriptions when the component is unmounted
//       client.unsubscribe(sessionID);
//     };
//   }, [sessionID]);
//
//   // Function to change poll count and publish the updated value
//   function changePollCount(_id, color) {
//     const topic = sessionID;
//     let message = "";
//     switch (_id) {
//       case 1: message = 'R'; break;  // Removed Host_ prefix since there are no hosts
//       case 2: message = 'Y'; break;
//       case 3: message = 'G'; break;
//       default: message = '';
//     }
//
//     client.publish(topic, message, function () {
//       console.log(`Message sent to topic ${topic}: ${message}`);
//     });
//
//     setDividerColor(color);
//   }
//
//   return (
//       <MainContainer className="MainContainer">
//         <Navigation mode="lecture" />
//         <FeedbackContainer className="FeedbackContainer">
//           <h2>My Feedback</h2>
//           <TopDivider className="TopDivider" style={{ backgroundColor: dividerColor }} />
//           <BtnContainer>
//             {data.map((element) => (
//                 <FeedbackOption
//                     key={element._id}
//                     btnProperty={element}
//                     func={() => changePollCount(element._id, element.color)}
//                 />
//             ))}
//           </BtnContainer>
//           <CompareBar colors={data} />
//         </FeedbackContainer>
//
//         <PreferenceContainer>
//           {buttons.map((button, _id) => (
//               <PreferenceButton
//                   key={_id}
//                   className="lectureButton"
//                   func={button.func}
//                   label={button.label}
//               />
//           ))}
//         </PreferenceContainer>
//       </MainContainer>
//   );
// }
