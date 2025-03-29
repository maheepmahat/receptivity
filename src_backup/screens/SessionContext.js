// import { createContext, useContext, useState } from 'react';
//
// const SessionContext = createContext();
//
// export const SessionProvider = ({ children }) => {
//     const [sessionID, setSessionID] = useState('');
//
//     return (
//         <SessionContext.Provider value={{ sessionID, setSessionID }}>
//             {children}
//         </SessionContext.Provider>
//     );
// };
//
// export const useSession = () => {
//     return useContext(SessionContext);
// };

import { createContext, useContext, useState } from 'react';
import React from 'react';

const SessionContext = createContext();

// SessionProvider: This provides a context for managing the sessionID.
// Now, all users are just participants, sharing the sessionID without any differentiation.
export const SessionProvider = ({ children }) => {
    const [sessionID, setSessionID] = useState('');

    return (
        <SessionContext.Provider value={{ sessionID, setSessionID }}>
            {children}
        </SessionContext.Provider>
    );
};

// useSession: A hook that allows components to access the session ID and its setter function.
export const useSession = () => {
    return useContext(SessionContext);
};
