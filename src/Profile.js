import React, { useContext, useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import userStandardImg from './User standard image.jpg';
import {user_profile_img, color_primary_opacity_medium, profile_posts_main_container, profile_buttons, img_40x40, profile_buttons_focused, input_btn_text, modal_bg, border_primary_x2, label_for_file, opacity_1, btn_primary, width_48, emoji_dropdown_menu, emoji_dropdown_title, write_post_container, close_preview, preview_image_container, posts_loading, profile_main_container, profile_buttons_container, remaining_chars, emoji_dropdown, posts_heading, bg_lightblue_gray, profile_no_posts, profile_no_posts_text, create_post_body} from './styles/Style.module.css';
import { authContext } from './global/AuthenticationContext';
import Emojis from './auxiliary/components/Emojis';
import 'firebase/firestore';
import 'firebase/firestore';
import UserPosts from './auxiliary/components/User Posts';
import Linkify from 'react-linkify';

export default function Profile() {

    const {photoURL, displayName, uid} = useContext(authContext);

    const [commentsValues, setCommentsValues] = useState({});

    const [userPosts, setUserPosts] = useState([{body: ''}]);

    const [searchProfile, setSearchProfile] = useState('');

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
        photos: false,
        followers: false,
        about: false
    };

    const [uploadImage, setUploadImage] = useState({

        visible: false,
        src: '',
        file: {},
    })
    
    const modalRef = useRef(null);
    const modalPostRef = useRef(null);

    const [modal, setModal] = useState(false);

    const [inputValues, setInputValues] = useState(inputValuesInital);

    const [contentSwitcher, setContentSwitcher] = useState({
        posts: true,
        photos: false,
        followers: false,
        about: false
    });

    useEffect(function() {

        const updatePosts = firebase.firestore().collection('users').doc(`${uid}`).onSnapshot(function(doc) {

            if (doc.data().posts.length) {

                setUserPostsBooleans({exist: true, error: false});
                setUserPosts(doc.data().posts.reverse());

                let newCommentsValues = {};

                for (const element of doc.data().posts.reverse()) {

                    newCommentsValues[`${element.postId}`] = '';

                }

                setCommentsValues(newCommentsValues);
 
            } else {

                setUserPostsBooleans({exist: false, error: true});
                setUserPosts([{body: 'No posts to show yet'}]);
            }
    
        });

        return () => updatePosts();

    }, [uid]);

    function IDGenerator() {
    
        const newID = Math.floor(Math.random() * 1000000000000000000000);

        let IDChecker = true;
    
        firebase.firestore().collection("users").doc(`${uid}`).get().then(function(doc) {

            if (doc.data().postsIds.includes(newID)) {

                IDChecker = false;
                
            } else {
                
                firebase.firestore().collection("users").doc(`${uid}`).update({
            
                    postsIds: firebase.firestore.FieldValue.arrayUnion(newID),
            
                }, {merge: true});

                IDChecker = true;
            }
        });

        return IDChecker ? newID : IDGenerator();

    }

    function escapePosts(e) {

        if (e.key === 'Escape') {
            setModal(false);
            setInputValues(inputValuesInital);
            setUploadImage({visible: false, src: '', file: {}});
            window.removeEventListener('keyup', escapePosts);
        }
    }

    return (
        
        <div className={`${profile_main_container}`}>

            <div className={`pr-4 pl-4 ${profile_posts_main_container}`}>

                {/* Modal */}

                <div className={`modal ${modal_bg} ${(modal || editModal) && "d-block"}`} tabIndex="-1">

                    <div className={`modal-dialog shadow`} ref={modalRef} role="document">
                        
                        <form
                        className="modal-content"
                        onSubmit={function(e) {

                            e.preventDefault();

                            if (!editModal) {

                                const id = IDGenerator();

                                if (uploadImage.file.name) {

                                    firebase.storage().ref().child(`posts/${uid}/${id}`).put(uploadImage.file, {contentType: 'image/jpeg'}).then(function() {firebase.storage().ref().child(`posts/${uid}/${id}`).getDownloadURL().then(function(imageUrl) {
            
                                        firebase.firestore().collection("users").doc(`${uid}`).update({
            
                                            posts: firebase.firestore.FieldValue.arrayUnion({
                                                date: `${(new Date().toLocaleString('default', {month: 'long'}))} ${(new Date().getDate()).toString().length === 1 ? `0${new Date().getDate()}` : new Date().getDate()}, ${new Date().getFullYear()}`,
                                                body: modalPostRef.current.innerText,
                                                hour: `${new Date().getHours().toString().length === 1 ? `0${new Date().getHours()}` : new Date().getHours()}:${(new Date().getMinutes()).toString().length === 1 ?  `0${new Date().getMinutes()}` : new Date().getMinutes()}`,
                                                imageUrl: imageUrl,
                                                comments: [],
                                                postId: id
                                            })
                
                                        }, {merge: true}).then(function() {setModal(false); setInputValues(inputValuesInital); setUploadImage({visible: false, src: '', file: {}});});
            
                                    }); });

                                } else {

                                    firebase.firestore().collection("users").doc(`${uid}`).update({
            
                                        posts: firebase.firestore.FieldValue.arrayUnion({
                                            date: `${(new Date().toLocaleString('default', {month: 'long'}))} ${(new Date().getDate()).toString().length === 1 ? `0${new Date().getDate()}` : new Date().getDate()}, ${new Date().getFullYear()}`,
                                            body: modalPostRef.current.innerText,
                                            hour: `${new Date().getHours().toString().length === 1 ? `0${new Date().getHours()}` : new Date().getHours()}:${(new Date().getMinutes()).toString().length === 1 ?  `0${new Date().getMinutes()}` : new Date().getMinutes()}`,
                                            imageUrl: '',
                                            comments: [],
                                            postId: id
                                        })
            
                                    }, {merge: true}).then(function() {setModal(false); setInputValues(inputValuesInital); setUploadImage({visible: false, src: '', file: {}});});
                                }

                            } else {

                                

                            }
                            
                        }}>

                            <div className="modal-header">

                                <h5 className="modal-title w-100 text-primary text-center">{editModal ? 'Edit Post' : 'Create post'}</h5>
                                <button type="button" className={`close p-2 btn text-primary ${opacity_1} ${btn_primary}`} onClick={function() {modal ? setModal(false) : setEditModal(false); setInputValues(inputValuesInital); setUploadImage({visible: false, src: '', file: {}});}}>&times;</button>

                            </div>

                            <div className="modal-body pt-0 pl-3">

                                <div className="d-flex flex-column">

                                    <div className="d-flex">

                                        <img className={`rounded-circle mr-2 mt-2 ${img_40x40} ${border_primary_x2}`} src={photoURL ? photoURL : userStandardImg} alt=""/>

                                        <h6 className="align-self-center text-primary mt-3">{displayName}</h6>

                                    </div>

                                    <Linkify>

                                        <div className={`mt-3 border rounded form-control ${create_post_body}`} contentEditable={true} name="post" ref={modalPostRef} onInput={function(e) {setInputValues({...inputValues, post: e.target.innerText.substring(0, 2500)}); setTimeout(() => modalPostRef.current.focus(), 0)}}>{inputValues.post}</div>

                                    </Linkify>


                                    <div className={`text-right mt-1 font-weight-bold ${remaining_chars}`}>{2500 - inputValues.post.length} characters left</div>

                                </div>

                                <div className={`justify-content-center mt-2 ${uploadImage.visible ? "d-flex" : "d-none"}`}>

                                    <div className={`w-50 ${preview_image_container}`}>

                                        <button type="button" className={`close position-relative btn ${opacity_1} ${close_preview}`} onClick={function() {setUploadImage({visible: false, src: '', file: {}});}}>&times;</button>
                                        <img src={uploadImage.src} alt="" className={`w-100 postion-absolute rounded `}/>

                                    </div>

                                </div>

                                <div className="position-relative mt-3 d-flex">
    
                                    <input
                                    type="file"
                                    className={`btn custom-file-input ${width_48}`}
                                    onChange={function(e) {

                                        const reader = new FileReader();

                                        reader.addEventListener('load', function() {

                                            setUploadImage({visible: true, src: reader.result, file: e.target.files[0]});
                                            e.target.value = "";

                                        })

                                        if (e.target.files[0]) {

                                            reader.readAsDataURL(e.target.files[0]);
                                        }

                                    }}/>

                                    <label className={`btn btn-success font-weight-bold ${width_48} ${label_for_file}`}>Add Image</label>

                                    <div className={`position-relative ml-4  ${emoji_dropdown}`}>

                                        <button className={`btn text-primary font-weight-bold w-100 ${emoji_dropdown_title}`} type="button">Emojis</button>
                                        
                                        <div className={`border-top-0 rounded-bottom mt-0 ${emoji_dropdown_menu}`} onClick={function(e) {e.target.name && setInputValues({...inputValues, post: inputValues.post + e.target.name})}}>

                                            <Emojis/>

                                        </div>

                                    </div>


                                </div>

                            </div>


                            <div className="modal-footer">

                                <button className="btn btn-primary form-control" disabled={!(inputValues.post.replace(/\s/g, '').length || uploadImage.visible) && true}>{editModal ? 'Edit' : 'Post'}</button>

                            </div>

                        </form>

                    </div>

                </div>

                <div className={`rounded-top pl-4 pr-4 pt-4 ${bg_lightblue_gray}`}>

                    <div className="text-center">

                        <img className={`rounded-circle ${user_profile_img}`} src={photoURL ? photoURL : userStandardImg} alt={displayName}/>

                        <h2 className={`align-self-center mt-2 mb-4 ${color_primary_opacity_medium}`}>{displayName}</h2>

                    </div>

                    <div className={`${profile_buttons_container}`}>

                        <button type="button" className={`font-weight-bold ${profile_buttons} ${contentSwitcher.posts && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, posts: true})}}>Posts</button>
                        <button type="button" className={`font-weight-bold ${profile_buttons} ${contentSwitcher.photos && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, photos: true})}}>Photos</button>
                        <button type="button" className={`font-weight-bold ${profile_buttons} ${contentSwitcher.followers && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, followers: true})}}>Followers</button>
                        <button type="button" className={`font-weight-bold mb-0 ${profile_buttons} ${contentSwitcher.about && profile_buttons_focused}`} onClick={function() {setContentSwitcher({...contentSwitcherInitial, about: true})}}>About</button>
                    
                    </div>

                </div>

                {contentSwitcher.posts && (

                    <>

                        <div className={`p-2 pt-3 rounded ${write_post_container}`} onClick={function() {setModal(true); window.addEventListener('keyup', escapePosts); setTimeout(() => modalPostRef.current.focus(), 0)}}>

                            <div className="d-flex w-100">

                                <img className={`rounded-circle mr-2 aling-self-center ${img_40x40}`} src={userStandardImg} alt=""/>

                                <div className={`rounded text-align-left bg-white align-self-center ${input_btn_text}`} type="button">Write post</div>

                            </div>

                        </div>                                                                                                                                                             

                        <div>

                            <h4 className={`p-2 text-center text-white rounded-bottom ${posts_heading}`}>Posts</h4>

                            <div>

                                {/* <div className={`p-2 rounded ${profile_sub_selectors_container}`}>

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


                                </div> */}

                                <div className={`w-100 ${!(!userPostsBooleans.exist && !userPostsBooleans.error) && 'justify-content-center'} ${!userPosts[0].hasOwnProperty('postId') && 'd-flex'}`}>

                                    {userPosts[0].hasOwnProperty('postId') ? (

                                        searchProfile.length ? (

                                            userPosts.some(obj => (obj.date.includes(searchProfile) || obj.body.includes(searchProfile))) ? (

                                                userPosts.map(obj => 
                                                    
                                                    (obj.date.includes(searchProfile) || obj.body.includes(searchProfile)) && (
                                                        
                                                        <UserPosts object={obj} commentsValues={commentsValues} setInputValues={setInputValues} setUploadImage={setUploadImage} setCommentsValues={setCommentsValues} setEditModal={setEditModal} IDGenerator={IDGenerator} key={obj.postId}/>
                                                        
                                                    )
                                                )

                                            ) : (

                                                <div className={`text-center text-muted ${(!userPostsBooleans.exist && !userPostsBooleans.error) && posts_loading}`}> No posts matching your search</div>

                                            )

                                        ) : (

                                            userPosts.map(obj => <UserPosts object={obj} commentsValues={commentsValues} setInputValues={setInputValues} setUploadImage={setUploadImage} setCommentsValues={setCommentsValues} setEditModal={setEditModal} IDGenerator={IDGenerator} key={obj.postId}/>) 
                                                
                                        )
                                            

                                    ) : (

                                        <div className={`d-flex w-100 rounded-top justify-content-center mt-4 p-3 ${profile_no_posts}`}>

                                            {(!userPostsBooleans.exist && !userPostsBooleans.error) ? (

                                                <>
                                                    <div className={`mr-1 ${posts_loading}`}></div>
                                                    <div className={`mr-1 ${posts_loading}`}></div>
                                                    <div className={`mr-1 ${posts_loading}`}></div>
                                                    <div className={`mr-1 ${posts_loading}`}></div>
                                                    <div className={`m-0 ${posts_loading}`}></div>

                                                </>

                                            ) : (

                                                <div className={`font-weight-bold ${profile_no_posts_text}`}>No posts to show yet</div>

                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </>

                )}

            </div>
        
        </div>
    )
}
