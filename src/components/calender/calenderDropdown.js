import React from 'react';
import Calendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css' // Default Style




class CalenderDropDown extends React.Component {
    render() {
        return (
            <div className="calender-dropdown hidebox " id="a">
                <Calendar />
            </div>
        )
    }

}

export default CalenderDropDown;