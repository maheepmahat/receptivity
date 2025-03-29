import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinHost from './screens/JoinHost';  // This can be renamed to just `Join` to reflect the changes
import ActiveView from './screens/ActiveView';  // All users will use ActiveView
import ParticipantList from './screens/ParticipantList';
import { SessionProvider } from './screens/SessionContext';
import { UserProvider } from './screens/UserContext';
import { getMqttClient } from './mqttconfig'; // Use the singleton client


function App() {
  useEffect(() => {
    const mqttClient = getMqttClient(); // Use the singleton MQTT client

    // Set up the connection and log once when the app loads
    mqttClient.on('connect', () => console.log('Connected to MQTT broker'));
    mqttClient.on('offline', () => console.warn('MQTT client is offline'));
    mqttClient.on('close', () => console.warn('MQTT client connection closed'));
    mqttClient.on('error', error => console.error('MQTT connection error:', error));

    // Optionally remove listeners to avoid duplication in future mounts
    return () => {
      mqttClient.removeAllListeners('connect');
      mqttClient.removeAllListeners('offline');
      mqttClient.removeAllListeners('close');
      mqttClient.removeAllListeners('error');
    };
  }, []); // Run once on mount

  return (
      <div className="App">
        <SessionProvider>
          <UserProvider>
            <Router>
              <Routes>
                <Route path='/' element={<JoinHost />} />
                <Route path='/active' element={<ActiveView />} />
                <Route path='/participants' element={<ParticipantList />} />
              </Routes>
            </Router>
          </UserProvider>
        </SessionProvider>
      </div>
  );
}

export default App;
