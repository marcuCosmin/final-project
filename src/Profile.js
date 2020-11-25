import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import userStandardImg from './User standard image.jpg';
import {user_profile_img, color_primary_opacity_medium, min_width_245, profile_buttons, min_width_161, img_40x40} from './link/Style.module.css';
import { authContext } from './global/AuthenticationContext';

export default function Profile() {

    const {photoURL, displayName} = useContext(authContext);

    const contentSwitcherInitial = {

        posts: false,
        followers: false,
        following: false,
        blocked_users: false
    };

    const [contentSwitcher, setContentSwitcher] = useState(contentSwitcherInitial);

    const [deviceWidth, setDeviceWidth] = useState(0);

    window.addEventListener('resize', function() {setDeviceWidth(window.innerWidth)});

    useEffect(function () {

        setDeviceWidth(window.innerWidth);

    }, [deviceWidth])

    return (

        <div className={`m-auto pr-4 pl-4 pt-4 ${deviceWidth < 1250 ? 'w-75' : 'w-50'} ${min_width_245}`}>

            <div className="bg-light border rounded pl-4 pr-4 pt-4">

                <div className="text-center">

                    <img className={`rounded-circle ${user_profile_img}`} src={photoURL ? photoURL : userStandardImg} alt={displayName}/>

                    <h2 className={`align-self-center mt-2 mb-4 ${color_primary_opacity_medium}`}>{displayName}</h2>

                </div>

                {deviceWidth > 924 && (

                <div className="d-flex justify-content-center">

                    <button type="button" className={`rounded font-weight-bold w-25 mr-2 ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, posts: true})}}>Posts</button>
                    <button type="button" className={`rounded font-weight-bold w-25 mr-2 ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, followers: true})}}>Followers</button>
                    <button type="button" className={`rounded font-weight-bold w-25 mr-2 ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, following: true})}}>Following</button>
                    <button type="button" className={`rounded font-weight-bold w-25 ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, blocked_users: true})}}>Blocked users</button>
                
                </div>

                )}

            </div>

            {deviceWidth <= 924 && (

                <div>
            
                    <div className={`w-100 border border-top-0 bg-light rounded-bottom p-2 ${min_width_161}`}>

                        <button type="button" className={`rounded-top font-weight-bold w-100 mb-2 d-block ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, posts: true})}}>Posts</button>
                        <button type="button" className={`rounded-top font-weight-bold w-100 mb-2 d-block ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, followers: true})}}>Followers</button>
                        <button type="button" className={`rounded-top font-weight-bold w-100 mb-2 d-block ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, following: true})}}>Following</button>
                        <button type="button" className={`rounded-top font-weight-bold w-100 d-block ${profile_buttons}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, blocked_users: true})}}>Blocked users</button>

                    </div>

                    <div className="mt-4">

                        {contentSwitcher.posts && (

                            <div className="d-flex">

                                <img className={`${img_40x40}`} src={userStandardImg} alt={displayName}/>

                                <button className="btn btn-primary mt-3" type="button">Post</button>

                            </div>

                        )}

                    </div>
                
                </div>
            )}

        </div>
    )
}
