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
                    padding: '20px',
                    border: `2px solid ${blink ? borderColor || 'blue' : 'transparent'}`,
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#333',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(173, 216, 230, 0.7)', // Light blue background with transparency
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                    transition: 'border 0.3s ease-in-out', // Smooth transition for border color
                }}
            >
                <div style={{ fontSize: '16px', marginBottom: '15px' }}>{text}</div>
                <button
                    onClick={onClose}
                    style={{
                        padding: '8px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                >
                    Close
                </button>
            </div>
        ),
        document.body
    );
};

export default BlinkingAlert;
