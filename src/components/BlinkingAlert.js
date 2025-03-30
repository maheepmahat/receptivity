import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const BlinkingAlert = ({ text, borderColor, onClose }) => {
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setBlink((prevBlink) => !prevBlink);
        }, 500); // Blinking interval in milliseconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return ReactDOM.createPortal(
        (
            <div
                id="blinking-alert"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '10px',
                    border: `2px solid ${blink ? borderColor || 'blue' : 'transparent'}`, // Only change border color
                    borderRadius: '5px',
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    backgroundColor: 'lightblue',
                }}
            >
                <div>{text}</div>
                <button onClick={onClose}>Close</button>
            </div>
        ),
        document.body
    );
};

export default BlinkingAlert;
