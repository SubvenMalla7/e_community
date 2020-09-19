import React, { useEffect, useState } from "react";

const firebase = require("firebase");

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUrser] = useState(null);
    const [pending, setPending] = useState(true);
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setCurrentUrser(user);
            setPending(false);
        });
    }, []);

    if (pending) {
        return (<> </>);
    }
    return (
        <AuthContext.Provider
            value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};