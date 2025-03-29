import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const BlinkingAlert = ({ text, borderColor, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setVisible((prevVisible) => !prevVisible);
        }, 500); // Blinking interval in milliseconds

        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
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
                    border: `2px solid ${borderColor || 'blue'}`,
                    borderRadius: '5px',
                    textAlign: 'center',
                    color: 'black',
                    fontWeight: 'bold',
                    backgroundColor: 'lightblue',
                    display: visible ? 'block' : 'none', // Toggle visibility for the entire modal
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
