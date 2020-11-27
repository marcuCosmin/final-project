import React, { useContext, useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import userStandardImg from './User standard image.jpg';
import {user_profile_img, color_primary_opacity_medium, min_width_245, profile_buttons, min_width_161, img_40x40, profile_buttons_focused, input_btn_text, input_btn_text_focus, modal_bg, border_primary_x2, label_for_file, opacity_1, btn_primary_hover, width_48, emoji_dropdown_menu, emoji_dropdown_title_hover, emoji_dropdown_title} from './styles/Style.module.css';
import { authContext } from './global/AuthenticationContext';
import Emojis from './auxiliary/Render Emojis';

export default function Profile() {

    const {photoURL, displayName} = useContext(authContext);

    const inputValuesInital = {

        post: ''
    };

    const contentSwitcherInitial = {

        posts: false,
        followers: false,
        following: false,
        blocked_users: false
    };

    const [dropdownEmojis, setDropdownEmojis] = useState(false);

    const modalRef = useRef(null);

    const [modal, setModal] = useState(false);

    const [inputValues, setInputValues] = useState(inputValuesInital);

    const [contentSwitcher, setContentSwitcher] = useState(contentSwitcherInitial);

    const [deviceWidth, setDeviceWidth] = useState(0);

    window.addEventListener('resize', function() {setDeviceWidth(window.innerWidth)});

    useEffect(function () {

        setDeviceWidth(window.innerWidth);

    }, [deviceWidth])

    function iControl(e) {

        if (e.target.name === "post") {

            setInputValues({...inputValues, post: e.target.value.substring(0, 400)});
        }

    } 

    return (

        <div className={`m-auto pr-4 pl-4 pt-4 ${deviceWidth < 1250 ? 'w-75' : 'w-50'} ${min_width_245}`}>

            {/* Modal */}

            <div className={`modal ${modal_bg} ${modal && "d-block"}`} tabIndex="-1" onKeyUp={function(e) {if (e.key === 'Escape') {setModal(false)}} }>

                <div className="modal-dialog" role="document">
                    
                    <form className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title w-100 text-primary text-center">Create post</h5>
                            <button type="button" className={`close btn text-primary ${opacity_1} ${btn_primary_hover}`} onClick={function() {setModal(false)}}>&times;</button>

                        </div>

                        <div className="modal-body pt-0 pl-3">

                            <div className="d-flex flex-column">

                                <div className="d-flex">

                                    <img className={`rounded-circle mr-2 mt-2 ${img_40x40} ${border_primary_x2}`} src={photoURL ? photoURL : userStandardImg} alt=""/>

                                    <h6 className="align-self-center text-primary mt-3">{displayName}</h6>

                                </div>

                                <textarea className="form-control mt-3" type="text" name="post" placeholder="Write a post" ref={modalRef} value={inputValues.post} onChange={iControl}></textarea>

                            </div>

                            <div className="position-relative mt-4 d-flex">
 
                                <input type="file" className={`btn custom-file-input ${width_48}`}/>
                                <label className={`btn btn-success font-weight-bold ${width_48} ${label_for_file}`}>Add Image</label>

                                <div className={`dropdown ml-4 ${width_48}`} onMouseEnter={function() {

                                    setDropdownEmojis(true);

                                }}
                                onMouseLeave={function() {

                                    setDropdownEmojis(false);

                                }}>

                                    <button className={`btn text-primary font-weight-bold w-100 ${emoji_dropdown_title} ${dropdownEmojis && emoji_dropdown_title_hover}`} type="button">Emojis</button>
                                    
                                    <div className={`border-top-0 rounded-bottom pb-2 mt-0 ${emoji_dropdown_menu} ${dropdownEmojis && 'd-block'}`}>

                                        <Emojis/>

                                    </div>

                                </div>


                            </div>

                        </div>


                        <div className="modal-footer">

                            <button className="btn btn-primary form-control" disabled={!inputValues.post}>Post</button>

                        </div>

                    </form>

                </div>

            </div>

            <div className="bg-light border rounded pl-4 pr-4 pt-4">

                <div className="text-center">

                    <img className={`rounded-circle ${user_profile_img}`} src={photoURL ? photoURL : userStandardImg} alt={displayName}/>

                    <h2 className={`align-self-center mt-2 mb-4 ${color_primary_opacity_medium}`}>{displayName}</h2>

                </div>

                {deviceWidth > 924 && (

                <div className="d-flex justify-content-center">

                    <button type="button" className={`rounded font-weight-bold w-25 mr-2 ${profile_buttons} ${contentSwitcher.posts && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, posts: true})}}>Posts</button>
                    <button type="button" className={`rounded font-weight-bold w-25 mr-2 ${profile_buttons} ${contentSwitcher.followers && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, followers: true})}}>Followers</button>
                    <button type="button" className={`rounded font-weight-bold w-25 mr-2 ${profile_buttons} ${contentSwitcher.following && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, following: true})}}>Following</button>
                    <button type="button" className={`rounded font-weight-bold w-25 ${profile_buttons} ${contentSwitcher.blocked_users && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, blocked_users: true})}}>Blocked users</button>
                
                </div>

                )}

            </div>

            {deviceWidth <= 924 && (

                <div>
            
                    <div className={`w-100 border border-top-0 bg-light rounded-bottom p-2 ${min_width_161}`}>

                        <button type="button" className={`rounded-top font-weight-bold w-100 mb-2 d-block ${profile_buttons} ${contentSwitcher.posts && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, posts: true})}}>Posts</button>
                        <button type="button" className={`rounded-top font-weight-bold w-100 mb-2 d-block ${profile_buttons} ${contentSwitcher.followers && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, followers: true})}}>Followers</button>
                        <button type="button" className={`rounded-top font-weight-bold w-100 mb-2 d-block ${profile_buttons} ${contentSwitcher.following && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, following: true})}}>Following</button>
                        <button type="button" className={`rounded-top font-weight-bold w-100 d-block ${profile_buttons} ${contentSwitcher.blocked_users && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, blocked_users: true})}}>Blocked users</button>

                    </div>

                    <div className="mt-4">

                        {contentSwitcher.posts && (

                            <div className="d-flex">

                                <img className={`rounded-circle ${img_40x40}`} src={userStandardImg} alt=""/>

                                <div className={`rounded text-align-left ${input_btn_text}`} type="button" onClick={function() {setModal(true); modalRef.current.focus()}}>Write post</div>

                            </div>

                        )}

                    </div>
                
                </div>
            )}

        </div>
    )
}
