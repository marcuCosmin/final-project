import React, {useContext, useState} from 'react'
import { authContext } from '../../global/AuthenticationContext';
import firebase from 'firebase/app';
import 'firebase/storage';
import {date, ellipsis, ellipsis_menu, ellipsis_items, ellipsis_items_special, ellipsis_container, comment_input, comment_input_container, comment_input_btns, post_description, label_for_file, comments_file_input, comments_label, comments_add_photo_container, posts_header, comment_emoji_dropdown_menu, emojis_style} from '../../styles/Style.module.css';
import 'firebase/firestore';
import { faTrash, faPen, faEllipsisV, faSmileBeam, faPaperPlane, faPhotoVideo, faEraser} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Linkify from 'react-linkify';
import Emojis from './Emojis';

export default function UserPosts({object, commentsValues, setCommentsValues, setEditModal, IDGenerator, setInputValues, setUploadImage}) {

    const {uid} = useContext(authContext);

    const [emojiDropdowns, setEmojiDropdowns] = useState({[object.postId]: false});

    console.log(emojiDropdowns);

    function escapeEdit(e) {

        if (e.key === "Escape") {

            setEditModal(false);
            window.removeEventListener('keyup', escapeEdit);
        }
    }

    function closeEmojiDropdown(e) {

        if (e.target.classList.contains(comment_emoji_dropdown_menu) || e.target.classList.contains(emojis_style)) {

            console.log(e.target);
        }

        setEmojiDropdowns({[object.postId]: false});

        window.removeEventListener('click', closeEmojiDropdown);
    }

    return (

        <div className="m-auto"> 

            <div className="border rounded mb-3">

                <div className={`rounded-top p-2 d-flex ${posts_header}`}>

                    <span className={`align-self-center font-weight-bold ${date}`}> {object.date} at {object.hour}</span>

                    <div className={`position-relative ml-auto ${ellipsis_container}`}>

                        <button type="button" className={`rounded-circle px-2 border-0 rounded-circle ml-auto align-self-center ${ellipsis}`}><FontAwesomeIcon icon={faEllipsisV}/></button>
                            
                        <div className={`position-absolute rounded-bottom ${ellipsis_menu}`}>

                            <button
                            type="buttton"
                            className={`w-100 ${[ellipsis_items, ellipsis_items_special].join(' ')}`}
                            onClick={function() {firebase.firestore().collection('users').doc(`${uid}`).update({posts: firebase.firestore.FieldValue.arrayRemove(object), postsIds: firebase.firestore.FieldValue.arrayRemove(object.postId)}); object.imageUrl && firebase.storage().ref().child(`posts/${uid}/${object.postId}`).delete()}}>

                                <FontAwesomeIcon icon={faTrash}/>

                            </button>

                            <button type="button" className={`w-100 rounded-bottom ${ellipsis_items}`} onClick={async function() {await setEditModal(true); object.body.length && setInputValues({post: object.body}); object.imageUrl && setUploadImage({visible: true, src: object.imageUrl, file: {}}); window.addEventListener('keyup', escapeEdit)}}><FontAwesomeIcon icon={faPen}/></button>

                        </div>

                    </div>

                </div>

                <div className={`border-bottom`}>

                    {object.body && (
                        
                        <div className={`p-2 ${post_description}`}>

                            <Linkify>

                                <div>{object.body}</div>

                            </Linkify>

                        </div>
                    )}

                    {object.imageUrl && (

                        <div>

                            <img src={object.imageUrl} className="w-100" alt="Failed to load"/>

                        </div>

                    )}

                </div>

                <form className={`d-flex ${comment_input_container}`} onSubmit={function(e) {e.preventDefault(); firebase.firestore().collection('users').doc(`${uid}`).update({posts: {...this, comments: firebase.firestore.FieldValue.arrayUnion(commentsValues[`${object.postId}`])}, commentsIds: firebase.firestore.FieldValue.arrayUnion(IDGenerator())}, {merge: true})}}>

                    {commentsValues.hasOwnProperty(`${object.postId}`) && (

                        <>

                            {/* <input type="text" placeholder="Write a comment..." value={commentsValues[`${object.postId}`]} className={`p-2 w-100 ${comment_input}`} onChange={function(e) {setCommentsValues({...commentsValues, [object.postId]: e.target.value});}}/> */}

                            <div className="w-100 p-2">

                                <div className={comment_input} contentEditable={true}></div>
                                <div></div>

                            </div>

                            <button className={`border-0 ${comment_input_btns}`} type="button" disabled={!commentsValues[`${object.postId}`].length > 0} onClick={function() {setCommentsValues({...commentsValues, [`${object.postId}`]: ''})}}><FontAwesomeIcon icon={faEraser}/></button>

                            <div className={`position-relative d-flex ${comments_add_photo_container}`}>

                                <input type="file" className={`${comments_file_input}`} id="customFile"/>
                                <label className={`m-0 w-100 text-center ${label_for_file} ${comment_input_btns} ${comments_label}`} htmlFor="customFile"><FontAwesomeIcon icon={faPhotoVideo}/></label>

                            </div>

                            <div className="d-flex position-relative" onClick={function() { setEmojiDropdowns({[object.postId]: true}); setTimeout(function() {window.addEventListener('click', closeEmojiDropdown)},0);}}>

                                <button className={`border-0 ${comment_input_btns}`} type="button"><FontAwesomeIcon icon={faSmileBeam}/></button>

                                <div className={`position-absolute rounded-bottom ${comment_emoji_dropdown_menu} ${emojiDropdowns[object.postId] ? 'd-block' : 'd-none'}`}>

                                    <Emojis/>

                                </div>

                            </div>

                            <button className={`border-0 ${comment_input_btns}`} type="submit" disabled={!commentsValues[`${object.postId}`].replace(/\s/g, '').length}><FontAwesomeIcon icon={faPaperPlane}/></button>

                        </>
                    
                    )}

                </form>

            </div>

        </div>
    )
}
