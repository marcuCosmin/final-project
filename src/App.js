import React, {useContext} from 'react';
import Header from './Header';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import firebase from 'firebase/app';
import Welcome from './Welcome';
import { authContext } from './global/AuthenticationContext';
import Settings from './Settings';
import Profile from './Profile';
import 'firebase/auth';

firebase.initializeApp({

  apiKey: "AIzaSyAK4badNNjoAyUqJ-T0zu1KW7Uf5xI5Z8o",
  authDomain: "siit-6-final-project.firebaseapp.com",
  databaseURL: "https://siit-6-final-project.firebaseio.com",
  projectId: "siit-6-final-project",
  storageBucket: "siit-6-final-project.appspot.com",
  messagingSenderId: "958475221084",
  appId: "1:958475221084:web:bcd1f39297243c1d7e4e99"

});

function App() {

  const {isSignedIn, displayName, uid} = useContext(authContext);

  return (

      <div>
        
        <Router>

          <Header/>

          <Route exact path="/" component={isSignedIn ? () => <h1>Abc</h1> : Welcome }/>

          <Route exact path="/settings" component={Settings}/>

          <Route exact path={`/${displayName}_${uid}`} component={Profile}/>

        </Router>

      </div>

  );

}

export default App;
