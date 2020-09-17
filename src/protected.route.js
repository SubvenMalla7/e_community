import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router'
import { AuthContext } from './Auth';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <Route {...rest} render={
            routeProps => !!currentUser ? (
                <Component {...routeProps} />
            ) : (
                    <Redirect to="/" />
                )
        } />
    )
}

export default ProtectedRoute