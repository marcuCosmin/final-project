import React from 'react';
import Nav from './Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Sign from './Sign';
import 'bootstrap/dist/css/bootstrap.css';
import firebase from 'firebase/app';

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

  return (
    <div>
      
      <Router>

        <Nav/>

        <Route exact path="/" component={() => <h1>Title</h1>}/>
        <Route exact path="/sign-in" component={Sign}/>

      </Router>

    </div>
  );
}

export default App;
