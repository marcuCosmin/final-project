import React, {useContext, useState, useEffect} from 'react'
import { authContext } from '../../global/AuthenticationContext';
import firebase from 'firebase/app';
import 'firebase/storage';
import {loading, date, ellipsis, post_comment_btn, ellipsis_menu, ellipsis_items, ellipsis_items_special, ellipsis_hover, comment_input, comment_input_container, comment_input_emoji, post_description} from '../../styles/Style.module.css';
import 'firebase/firestore';
import { faTrash, faPen, faEllipsisV, faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UserPosts() {

    const {uid} = useContext(authContext);

    const [userPosts, setUserPosts] = useState([{body: ''}]);

    const [editPosts, setEditPosts] = useState({});

    const [userPostsBooleans, setUserPostsBooleans] = useState({

        exist: false,
        error: false
    });

    useEffect(function() {

        const updatePosts = firebase.firestore().collection('users').doc(`${uid}`).onSnapshot(function(doc) {

            if (doc.data().posts.length) {

                setUserPostsBooleans({exist: true, error: false});
                setUserPosts(doc.data().posts.reverse());

                let newEditPosts = {};

                for (const element of doc.data().posts) {

                    newEditPosts = {...newEditPosts, [`post-${element.postId}`]: false};
                }

                setEditPosts(newEditPosts);
 
            } else {

                setUserPostsBooleans({exist: false, error: true});
                setUserPosts([{body: 'No posts to show yet'}]);
            }
    
        });

        return () => updatePosts();

    }, [uid])

    return (

        <div className="m-auto">

            {userPostsBooleans.exist ? (

                userPosts.map(object => 

                    <div className="border rounded mb-3" key={object.postId}>

                        <div className="bg-light rounded-top p-2 d-flex">

                            <span className={`align-self-center font-weight-bold ${date}`}> Posted at: {object.date} {object.hour}</span>

                            <div className="position-relative ml-auto" onMouseEnter={function() {setEditPosts({...editPosts, [`post-${object.postId}`]: true})}} onMouseLeave={function() {setEditPosts({...editPosts, [`post-${object.postId}`]: false})}}>

                                <button type="button" className={`rounded-circle px-2 border-0 rounded-circle ml-auto align-self-center ${ellipsis} ${editPosts[`post-${object.postId}`] && ellipsis_hover}`}><FontAwesomeIcon icon={faEllipsisV}/></button>
                                 
                                <div className={`position-absolute border rounded-bottom ${ellipsis_menu} ${!editPosts[`post-${object.postId}`] && 'd-none'}`}>

                                    <button
                                    type="buttton"
                                    className={`w-100 ${[ellipsis_items, ellipsis_items_special].join(' ')}`}
                                    onClick={function() {firebase.firestore().collection('users').doc(`${uid}`).update({posts: firebase.firestore.FieldValue.arrayRemove(object), postsIds: firebase.firestore.FieldValue.arrayRemove(object.postId)}); firebase.storage().ref().child(`posts/${uid}/${object.postId}`).delete()}}>

                                        <FontAwesomeIcon icon={faTrash}/>

                                    </button>

                                    <button type="button" className={`w-100 rounded-bottom ${ellipsis_items}`}><FontAwesomeIcon icon={faPen}/></button>

                                </div>

                            </div>

                        </div>

                        <div className={`m-2 ${post_description}`}>{object.body}</div>

                        {object.imageUrl !== "" && (

                            <div>

                                <img src={object.imageUrl} className="w-100" alt="Failed to load image"/>

                            </div>

                        )}

                        <button className={`rounded-bottom font-weight-bold rounded-0 bg-light text-center w-100 ${post_comment_btn}`}>Comment</button>

                        <div className={`d-flex ${comment_input_container}`}>

                            <input type="text" placeholder="Write a comment..." className={`p-2 w-100 ${comment_input}`}/>

                            <button className={`border-0 ${comment_input_emoji}`} type="button"><FontAwesomeIcon icon={faSmileBeam}/></button>

                        </div>

                    </div>

                )

            ) : (

                <div className={`text-center text-muted ${(!userPostsBooleans.exist && !userPostsBooleans.error) && loading}`}>

                    {userPosts[0].body}

                </div>

            )}

        </div>
    )
}
