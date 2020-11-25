import React, {useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const authContext = React.createContext({
    isSignedIn: false,
    user: null,
    displayName: '',
    emailVerified: false,
    uid: '',
    photoURL: null
});

function ACProvider({children}) {

    const [acValues, setAcValues] = useState({
        isSignedIn: false,
        user: null,
        displayName: '',
        emailVerified: false,
        uid: '',
        photoURL: null
    });

    useEffect(function() {

        firebase.auth().onAuthStateChanged(function (user) {

            if (user) {
              
                setAcValues({
                    isSignedIn: true,
                    user,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified,
                    uid: user.uid,
                    photoURL: user.photoURL
                });

            } else {

                setAcValues({
                    isSignedIn: false,
                    user: null,
                    displayName: '',
                    emailVerified: false,
                    uid: '',
                    photoURL: null
                });

            }
        });

    }, []);

    return (

        <authContext.Provider value={acValues}>
            {children}
        </authContext.Provider>
    );
}

export {authContext, ACProvider};