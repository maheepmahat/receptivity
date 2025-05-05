// import React from 'react';
// import "./ActiveViewHost.css";
// import Navigation from '../components/Navigation';
// import FeedbackOption from "../components/FeedbackOption";
// import fast_forward from "../images/fast_forward.png";
// import pause from "../images/pause.png";
// import play from "../images/play.png";
// import CompareBar from "../components/CompareBar";
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
// // Logging function
// function formatLogEntry(message, userType = 'host', color = 'N/A') {
//   const dateObj = new Date();
//   const formattedDate = dateObj.toISOString().split('T')[0];  // 'YYYY-MM-DD'
//   const formattedTime = dateObj.toTimeString().split(' ')[0];  // 'HH:MM:SS'
//   const formattedTimestamp = `${formattedDate} ${formattedTime}`;
//
//   const userName = 'UnknownUser';  // Replace this with actual username if available
//
//   return `${formattedTimestamp} | ${userType} | ${userName} | ${color} | ${message}`;
// }
//
// const buttons = [
//   {
//     label: "Switch To Lecture Mode",
//     func: function () {
//       // Redirect to another page
//       window.location.href = '/host';
//     },
//   },
//   {
//     label: "Clear my Feedback",
//     func: function () {
//       console.log(formatLogEntry("Clear my Feedback Button", 'host'));
//     },
//   },
// ];
//
// export default function ActiveViewHostDiscussion() {
//   const [dividerColor, setDividerColor] = React.useState('#484846;');
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
//   function changePollCount(_id, color) {
//     const obj = data.map((element) => {
//       if (element._id === _id) {
//         let count = element.count + 1;
//         console.log(formatLogEntry(`Updated count for ${element.label}: ${count}`, 'host', color));
//         return { ...element, count };
//       } else return element;
//     });
//
//     setData(obj);
//     setDividerColor(color);
//   }
//
//   const [audienceFeedbackVisible, setAudienceFeedbackVisible] = React.useState(false);
//   const handleAudienceFeedbackClick = () => {
//     // Toggle the visibility of group feedback
//     setAudienceFeedbackVisible(!audienceFeedbackVisible);
//     console.log(formatLogEntry(`Audience feedback visibility toggled to: ${!audienceFeedbackVisible}`, 'host'));
//   };
//
//   return (
//       <MainContainer className="MainContainer">
//         <Navigation mode="discussion" handleAudienceFeedbackClick={handleAudienceFeedbackClick} />
//         <FeedbackContainer className="FeedbackContainer">
//           <h2>My Feedback</h2>
//           <TopDivider className="TopDivider" style={{ backgroundColor: dividerColor }}></TopDivider>
//           <BtnContainer>
//             {data.map((element) => (
//                 <FeedbackOption
//                     key={element._id}
//                     btnProperty={element}
//                     func={() => changePollCount(element._id, element.color)}
//                 ></FeedbackOption>
//             ))}
//           </BtnContainer>
//           <CompareBar colors={data}></CompareBar>
//           {audienceFeedbackVisible && <h2>Audience feedback: 100%</h2>}
//         </FeedbackContainer>
//         <PreferenceContainer>
//           {buttons.map((button, _id) => (
//               <PreferenceButton
//                   key={_id}
//                   func={button.func}
//                   label={button.label}
//               ></PreferenceButton>
//           ))}
//         </PreferenceContainer>
//       </MainContainer>
//   );
// }
