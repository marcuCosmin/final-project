import React, { useContext, useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import userStandardImg from './User standard image.jpg';
import {user_profile_img, color_primary_opacity_medium, min_width_245, profile_buttons, min_width_161, img_40x40, profile_buttons_focused, input_btn_text, modal_bg, border_primary_x2, label_for_file, opacity_1, btn_primary, width_48, emoji_dropdown_menu, emoji_dropdown_title_hover, emoji_dropdown_title, write_post_container, preview_image, close_preview, preview_image_container, loading, profile_sub_selectors_container, profile_sub_search_container, profile_sub_search, profile_sub_btn, posts_container, posts_info, posts_info_container, profile_options_btn, profile_photos_preview} from './styles/Style.module.css';
import { authContext } from './global/AuthenticationContext';
import Emojis from './auxiliary/components/Emojis';
import 'firebase/firestore';
import 'firebase/firestore';
import UserPosts from './auxiliary/components/User Posts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faImages, faInfo} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {

    const {photoURL, displayName, uid} = useContext(authContext);

    const [commentsValues, setCommentsValues] = useState({});

    const [userPosts, setUserPosts] = useState([{body: ''}]);

    const [searchProfile, setSearchProfile] = useState('');

    const [photosPreview, setPhotoPreview] = useState([]);

    console.log(photosPreview);

    const [userPostsBooleans, setUserPostsBooleans] = useState({

        exist: false,
        error: false
    });
    
    const inputValuesInital = {

        post: ''
    };

    const [editModal, setEditModal] = useState(false);

    const contentSwitcherInitial = {

        posts: false,
        followers: false,
        following: false,
        blocked_users: false
    };

    const [dropdownEmojis, setDropdownEmojis] = useState(false);

    const [uploadImage, setUploadImage] = useState({

        visible: false,
        src: ''
    })

    const modalRef = useRef(null);

    const postImageRef = useRef(null);

    const [modal, setModal] = useState(false);

    const [inputValues, setInputValues] = useState(inputValuesInital);

    const [contentSwitcher, setContentSwitcher] = useState({
        posts: true,
        followers: false,
        following: false,
        blocked_users: false
    });

    const [deviceWidth, setDeviceWidth] = useState(0);

    window.addEventListener('resize', function() {setDeviceWidth(window.innerWidth)});

    useEffect(function () {

        setDeviceWidth(window.innerWidth);

    }, [deviceWidth]);

    useEffect(function() {

        const updatePosts = firebase.firestore().collection('users').doc(`${uid}`).onSnapshot(function(doc) {

            if (doc.data().posts.length) {

                setUserPostsBooleans({exist: true, error: false});
                setUserPosts(doc.data().posts.reverse());

                let newCommentsValues = {};

                let newPhotosPreview = [];

                for (const element of doc.data().posts.reverse()) {

                    newCommentsValues[`${element.postId}`] = '';

                    if (element.imageUrl && photosPreview.length < 6) {

                        newPhotosPreview.push(element.imageUrl);
                    }

                }

                setCommentsValues(newCommentsValues);
                setPhotoPreview(newPhotosPreview);
 
            } else {

                setUserPostsBooleans({exist: false, error: true});
                setUserPosts([{body: 'No posts to show yet'}]);
            }
    
        });

        return () => updatePosts();

    }, [uid]);

    function IDGenerator() {
    
        const newId = Math.floor(Math.random() * 100000000000000000000);
    
        firebase.firestore().collection("users").doc(`${uid}`).get().then(function(doc) {
    
            doc.data().postsIds.includes(newId) && IDGenerator();
        })
    
        firebase.firestore().collection("users").doc(`${uid}`).update({
    
            postsIds: firebase.firestore.FieldValue.arrayUnion(newId),
    
        }, {merge: true});
    
        return newId;
    }

    function escapePosts(e) {

        if (e.key === 'Escape') {
            setModal(false);
            setInputValues(inputValuesInital);
            setUploadImage({visible: false, src: ''});
            postImageRef.current.value = null;
            window.removeEventListener('keyup', escapePosts);
        }
    }

    return (

        <div className={`pr-4 pl-4 pt-4 ${deviceWidth < 1250 ? 'w-75' : 'w-50'} ${min_width_245}`}>

            {/* Modal */}

            <div className={`modal ${modal_bg} ${(modal || editModal) && "d-block"}`} tabIndex="-1">

                <div className="modal-dialog shadow" role="document">
                    
                    <form
                    className="modal-content"
                    onSubmit={function(e) {

                        e.preventDefault();

                        const id = IDGenerator();

                        if (postImageRef.current.files[0]) {

                            firebase.storage().ref().child(`posts/${uid}/${id}`).put(postImageRef.current.files[0], {contentType: 'image/jpeg'}).then(function() {firebase.storage().ref().child(`posts/${uid}/${id}`).getDownloadURL().then(function(imageUrl) {
    
                                firebase.firestore().collection("users").doc(`${uid}`).update({
    
                                    posts: firebase.firestore.FieldValue.arrayUnion({
                                        date: `${(new Date().toLocaleString('default', {month: 'long'}))} ${(new Date().getDate()).toString().length === 1 ? `0${new Date().getDate()}` : new Date().getDate()}, ${new Date().getFullYear()}`,
                                        body: inputValues.post,
                                        hour: `${new Date().getHours().toString().length === 1 ? `0${new Date().getHours()}` : new Date().getHours()}:${(new Date().getMinutes()).toString().length === 1 ?  `0${new Date().getMinutes()}` : new Date().getMinutes()}`,
                                        imageUrl,
                                        comments: [],
                                        postId: id
                                    })
        
                                }, {merge: true}).then(function() {setModal(false); setInputValues(inputValuesInital); setUploadImage({visible: false, src: ''}); postImageRef.current.value = null; });
    
                            }); });

                        } else {

                            firebase.firestore().collection("users").doc(`${uid}`).update({
    
                                posts: firebase.firestore.FieldValue.arrayUnion({
                                    date: `${(new Date().toLocaleString('default', {month: 'long'}))} ${(new Date().getDate()).toString().length === 1 ? `0${new Date().getDate()}` : new Date().getDate()}, ${new Date().getFullYear()}`,
                                    body: inputValues.post,
                                    hour: `${new Date().getHours().toString().length === 1 ? `0${new Date().getHours()}` : new Date().getHours()}:${(new Date().getMinutes()).toString().length === 1 ?  `0${new Date().getMinutes()}` : new Date().getMinutes()}`,
                                    imageUrl: '',
                                    comments: [],
                                    postId: id
                                })
    
                            }, {merge: true}).then(function() {setModal(false); setInputValues(inputValuesInital); setUploadImage({visible: false, src: ''}); postImageRef.current.value = null; });
                        }
                        
                    }}>

                        <div className="modal-header">

                            <h5 className="modal-title w-100 text-primary text-center">Create post</h5>
                            <button type="button" className={`close p-2 btn text-primary ${opacity_1} ${btn_primary}`} onClick={function() {modal ? setModal(false) : setEditModal(false); setInputValues(inputValuesInital); setUploadImage({visible: false, src: ''}); postImageRef.current.value = null;}}>&times;</button>

                        </div>

                        <div className="modal-body pt-0 pl-3">

                            <div className="d-flex flex-column">

                                <div className="d-flex">

                                    <img className={`rounded-circle mr-2 mt-2 ${img_40x40} ${border_primary_x2}`} src={photoURL ? photoURL : userStandardImg} alt=""/>

                                    <h6 className="align-self-center text-primary mt-3">{displayName}</h6>

                                </div>

                                <textarea className="form-control mt-3" type="text" name="post" placeholder="Write a post" ref={modalRef} value={inputValues.post} onChange={function(e) {setInputValues({...inputValues, post: e.target.value.substring(0, 1000)});}}></textarea>

                            </div>

                            <div className="d-flex justify-content-center mt-3">

                                <div className={`w-50 ${preview_image_container}`}>

                                    <button type="button" className={`close position-relative btn ${opacity_1} ${close_preview}`} onClick={function() {setUploadImage({visible: false, src: ''}); postImageRef.current.value = null;}}>&times;</button>
                                    <img src={uploadImage.src} alt="" className={`w-100 postion-absolute rounded ${preview_image} ${!uploadImage.visible && "d-none"}`}/>

                                </div>

                            </div>

                            <div className="position-relative mt-3 d-flex">
 
                                <input
                                type="file"
                                className={`btn custom-file-input ${width_48}`}
                                ref={postImageRef}
                                onChange={function(e) {

                                    const reader = new FileReader();

                                    reader.addEventListener('load', function() {

                                        setUploadImage({visible: true, src: reader.result});

                                    })

                                    if (e.target.files[0]) {

                                        reader.readAsDataURL(e.target.files[0]);
                                    }

                                }}/>
                                <label className={`btn btn-success font-weight-bold ${width_48} ${label_for_file}`}>Add Image</label>

                                <div className={`dropdown ml-4 ${width_48}`} onMouseEnter={function() {

                                    setDropdownEmojis(true);

                                }}
                                onMouseLeave={function() {

                                    setDropdownEmojis(false);

                                }}>

                                    <button className={`btn text-primary font-weight-bold w-100 ${emoji_dropdown_title} ${dropdownEmojis && emoji_dropdown_title_hover}`} type="button">Emojis</button>
                                    
                                    <div className={`border-top-0 rounded-bottom pb-2 mt-0 ${emoji_dropdown_menu} ${dropdownEmojis && 'd-block'}`} onClick={function(e) {e.target.name && setInputValues({...inputValues, post: inputValues.post + String.fromCodePoint(e.target.name)})}}>

                                        <Emojis/>

                                    </div>

                                </div>


                            </div>

                        </div>


                        <div className="modal-footer">

                            <button className="btn btn-primary form-control" disabled={!(inputValues.post.replace(/\s/g, '').length || uploadImage.visible) && true}>Post</button>

                        </div>

                    </form>

                </div>

            </div>

            <div className={`bg-light rounded-top pl-4 pr-4 pt-4 ${deviceWidth <+ 924 && 'border'}`}>

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
            
                    <div className={`w-100 border rounded-0 border-bottom-0 border-top-0 bg-light rounded-bottom p-2 ${min_width_161}`}>

                        <button type="button" className={`rounded font-weight-bold w-100 mb-2 d-block ${profile_buttons} ${contentSwitcher.posts && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, posts: true})}}>Posts</button>
                        <button type="button" className={`rounded font-weight-bold w-100 mb-2 d-block ${profile_buttons} ${contentSwitcher.followers && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, followers: true})}}>Followers</button>
                        <button type="button" className={`rounded font-weight-bold w-100 mb-2 d-block ${profile_buttons} ${contentSwitcher.following && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, following: true})}}>Following</button>
                        <button type="button" className={`rounded font-weight-bold w-100 d-block ${profile_buttons} ${contentSwitcher.blocked_users && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, blocked_users: true})}}>Blocked users</button>

                    </div>
                
                </div>

            )}

            {contentSwitcher.posts && (

                <>

                    <div className="border rounded-0 p-3">

                        <div className={`p-2 rounded ${write_post_container}`} onClick={function() {setModal(true); window.addEventListener('keyup', escapePosts); setTimeout(() => modalRef.current.focus(), 0)}}>

                            <div className="d-flex w-100">

                                <img className={`rounded-circle mr-2 aling-self-center ${img_40x40}`} src={userStandardImg} alt=""/>

                                <div className={`rounded text-align-left bg-white align-self-center ${input_btn_text}`} type="button">Write post</div>

                            </div>

                        </div>

                    </div>                                                                                                                                                                                            

                    <div className="border border-top-0 rounded-bottom">

                        <h4 className="p-2 text-center text-primary bg-light border-bottom">Posts</h4>

                        <div className="d-flex">

                            <div className={`p-2 rounded ${profile_sub_selectors_container}`}>

                                <div className={`d-flex rounded ${profile_sub_search_container}`}>

                                    <input type="text" placeholder="Search Post" className={`w-100 border-0 ${profile_sub_search}`} value={searchProfile} onChange={e => setSearchProfile(e.target.value)}/>
                                    <button type="button" className={`border-0 ${profile_sub_btn}`} disabled={!searchProfile} onClick={() => setSearchProfile('')}><FontAwesomeIcon icon={faEraser}/></button>

                                    <div className={`position relative ${posts_info_container}`}>

                                        <button type="button" className={`border-0 rounded-right ${profile_sub_btn}`}><FontAwesomeIcon icon={faInfo}/></button>
                                        <div className={`position-absolute p-2 ${posts_info}`}>Search posts by description or date</div>

                                    </div>

                                </div>

                                <div className="mt-3">

                                    <span className={`font-weight-bold ${profile_options_btn}`}>Photos<FontAwesomeIcon className="ml-1" icon={faImages}/> </span>

                                    <div className="d-flex justify-content-between mt-2 flex-wrap">

                                        {photosPreview.map((e) => 

                                            <img className={`rounded mb-2 ${profile_photos_preview}`} src={e} alt="" key={e}/>
                                        )}

                                    </div>

                                </div>

                            </div>

                            <div className={`ml-auto ${!userPosts[0].hasOwnProperty('postId') && 'd-flex'} ${posts_container}`}>

                                {userPosts[0].hasOwnProperty('postId') ? (

                                    searchProfile.length ? (

                                        userPosts.some(obj => (obj.date.includes(searchProfile) || obj.body.includes(searchProfile))) ? (

                                            userPosts.map(obj => 
                                                
                                                (obj.date.includes(searchProfile) || obj.body.includes(searchProfile)) && (
                                                    
                                                    <UserPosts object={obj} commentsValues={commentsValues} setCommentsValues={setCommentsValues} setEditModal={setEditModal} IDGenerator={IDGenerator} key={obj.postId}/>
                                                    
                                                )
                                            )

                                        ) : (

                                            <div className={`text-center text-muted ${(!userPostsBooleans.exist && !userPostsBooleans.error) && loading}`}> No posts matching your search</div>

                                        )

                                    ) : (

                                        userPosts.map(obj => <UserPosts object={obj} commentsValues={commentsValues} setCommentsValues={setCommentsValues} setEditModal={setEditModal} IDGenerator={IDGenerator} key={obj.postId}/>) 
                                            
                                    )
                                          

                                ) : (
                                                
                                    <div className={`text-center text-muted align-self-center m-auto ${(!userPostsBooleans.exist && !userPostsBooleans.error) && loading}`}> {`${(!userPostsBooleans.exist && !userPostsBooleans.error) ? "" : "No posts to show yet"}`}</div>

                                )}

                            </div>

                        </div>

                    </div>

                </>

            )}

        </div>
    )
}
