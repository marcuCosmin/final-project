import React, {useState} from 'react';
import {settings_container, m_auto, settings_buttons, settings_selected_title} from './link/Style.module.css';

export default function Settings() {

    const [displayedSettings, setDisplayedSettings] = useState('General');

    return (

        <div className={`d-flex justify-content-center w-75 flex-wrap mt-4 ${m_auto}`}>

            <div className={`bg-light border-left border-top border-bottom rounded-left w-25 justify-content-center ${settings_container}`}>

                <h5 className="text-white bg-primary p-2 text-center text-wrap mb-0">Settings</h5>

                <div className="justify-content-center text-center">

                    <div className={`text-muted p-2 ${settings_buttons}`}>General</div>
                    <div className={`text-muted p-2 ${settings_buttons}`}>Personal Info</div>

                </div>

            </div>

            <div className="border rounded-right w-50">

                <h5 className={`font-weight-bold p-2 text-center border-bottom ${settings_selected_title}`}>{displayedSettings}</h5>

                <div></div>

            </div>
            
        </div>
    )
}
