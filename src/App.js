import React from 'react';
import Nav from './Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Sign from './Sign';
import 'bootstrap/dist/css/bootstrap.css';

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
