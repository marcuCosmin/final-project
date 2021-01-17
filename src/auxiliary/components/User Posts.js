import React, {useContext} from 'react'
import { authContext } from '../../global/AuthenticationContext';
import firebase from 'firebase/app';
import 'firebase/storage';
import {date, ellipsis, post_comment_btn, ellipsis_menu, ellipsis_items, ellipsis_items_special, ellipsis_container, comment_input, comment_input_container, comment_input_btns, post_description} from '../../styles/Style.module.css';
import 'firebase/firestore';
import { faTrash, faPen, faEllipsisV, faSmileBeam, faPaperPlane, faPhotoVideo, faEraser} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UserPosts({object, commentsValues, setCommentsValues, setEditModal, IDGenerator}) {

    const {uid} = useContext(authContext);

    function escapeEdit(e) {

        if (e.key === "Escape") {

            setEditModal(false);
            window.removeEventListener('keyup', escapeEdit);
        }
    }

    return (

        <div className="m-auto"> 

            <div className="border rounded mb-3">

                <div className="bg-light rounded-top p-2 d-flex">

                    <span className={`align-self-center font-weight-bold ${date}`}> {object.date} at {object.hour}</span>

                    <div className={`position-relative ml-auto ${ellipsis_container}`}>

                        <button type="button" className={`rounded-circle px-2 border-0 rounded-circle ml-auto align-self-center ${ellipsis}`}><FontAwesomeIcon icon={faEllipsisV}/></button>
                            
                        <div className={`position-absolute border rounded-bottom ${ellipsis_menu}`}>

                            <button
                            type="buttton"
                            className={`w-100 ${[ellipsis_items, ellipsis_items_special].join(' ')}`}
                            onClick={function() {firebase.firestore().collection('users').doc(`${uid}`).update({posts: firebase.firestore.FieldValue.arrayRemove(object), postsIds: firebase.firestore.FieldValue.arrayRemove(object.postId)}); object.imageUrl && firebase.storage().ref().child(`posts/${uid}/${object.postId}`).delete()}}>

                                <FontAwesomeIcon icon={faTrash}/>

                            </button>

                            <button type="button" className={`w-100 rounded-bottom ${ellipsis_items}`} onClick={function() {setEditModal(true); window.addEventListener('keyup', escapeEdit)}}><FontAwesomeIcon icon={faPen}/></button>

                        </div>

                    </div>

                </div>

                <div className={`p-2 ${post_description}`}>

                    <div>{object.body}</div>

                </div>

                {object.imageUrl !== "" && (

                    <div>

                        <img src={object.imageUrl} className="w-100" alt="Failed to load image"/>

                    </div>

                )}

                <button className={`rounded-bottom font-weight-bold rounded-0 bg-light text-center w-100 ${post_comment_btn}`}>Comment</button>

                <form className={`d-flex ${comment_input_container}`} onSubmit={function(e) {e.preventDefault(); firebase.firestore().collection('users').doc(`${uid}`).update({posts: {...this, comments: firebase.firestore.FieldValue.arrayUnion(commentsValues[`${object.postId}`])}, commentsIds: firebase.firestore.FieldValue.arrayUnion(IDGenerator())}, {merge: true})}}>

                    {commentsValues.hasOwnProperty(`${object.postId}`) && (

                        <>

                            <input type="text" placeholder="Write a comment..." value={commentsValues[`${object.postId}`]} className={`p-2 w-100 ${comment_input}`} onChange={function(e) {setCommentsValues({...commentsValues, [object.postId]: e.target.value});}}/>
                            <button className={`border-0 ${comment_input_btns}`} type="button" disabled={!commentsValues[`${object.postId}`].length > 0} onClick={function() {setCommentsValues({...commentsValues, [`${object.postId}`]: ''})}}><FontAwesomeIcon icon={faEraser}/></button>
                            <button className={`border-0 ${comment_input_btns}`} type="button"><FontAwesomeIcon icon={faPhotoVideo}/></button>
                            <button className={`border-0 ${comment_input_btns}`} type="button"><FontAwesomeIcon icon={faSmileBeam}/></button>
                            <button className={`border-0 ${comment_input_btns}`} type="submit" disabled={!commentsValues[`${object.postId}`].replace(/\s/g, '').length}><FontAwesomeIcon icon={faPaperPlane}/></button>

                        </>
                    
                    )}

                </form>

            </div>

        </div>
    )
}
