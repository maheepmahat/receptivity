//
// import { useState, useContext, createContext } from 'react';
//
// const UserContext = createContext();
//
// export const UserProvider = ({ children }) => {
//     const [username, setUsername] = useState('');
//
//     const updateUser = (newUsername) => {
//         setUsername(newUsername);
//     };
//
//     return (
//         <UserContext.Provider value={{ username, updateUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };
//
// export const useUser = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//         throw new Error('useUser must be used within a UserProvider');
//     }
//     return context;
// };
import { useState, useContext, createContext } from 'react';

const UserContext = createContext();

// UserProvider: This provides a context for managing the username of each user.
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState('');

    // updateUser: Function to update the username.
    const updateUser = (newUsername) => {
        setUsername(newUsername);
    };

    return (
        <UserContext.Provider value={{ username, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

// useUser: A hook that allows components to access and update the username.
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
