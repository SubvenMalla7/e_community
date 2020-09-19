import React from 'react';
import Calendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css' // Default Style
import { withRouter } from 'react-router';
import Navbar from '../components/navBar/Header';
class MobCalender extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <div style={{ height: "20vh" }}></div>
                <div style={{ paddingLeft: "11%" }}> <Calendar /></div>
            </>
        )
    }
}

export default withRouter(MobCalender);