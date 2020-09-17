import React, { useEffect, useState } from "react";
const firebase = require("firebase");

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUrser] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(setCurrentUrser);
    }, []);

    return (
        <AuthContext.Provider
            value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};