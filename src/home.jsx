import React from 'react';
import ReactDOM from 'react-dom';
//import * as serviceWorker from './serviceWorker';
import './home.css';
import {Button} from "@material-ui/core";
import { BrowserRouter, Link } from 'react-router-dom';


function App() {
  return (
    <div>
      <section id="buttons">
        <header>
          <img src="../images/PredictLogo.png" width="250" alt="logo" />
          <ul>
          <Button
              type="submit"
              fullwidthvariant = "True"
              background = "#00FF9E"
              color = "primary"
              className="sign-in"
              >
              <a href="login#/login">
              SIGN IN
              </a>
              </Button>

              <Button
              type="submit"
              fullwidthvariant = "True"
              color="primary"
              className="sign-up"
              >
              <a href="login#/register">
              SIGN UP
              </a>
              </Button>
          </ul>
        </header>
      </section>
      <section id="main">
       <div className="main-text">
         Predictivity.<br></br> Understand how your <br></br>buildings are being used.
       </div>
       <img src="../images/thumbprint.png" width="250"alt="cool-main-image"/>
      </section>
      <section id="sub">
        <div className="sub-text">
          Developed by AI<br></br>Experts from Stanford
        </div>
        <div className="sub-sub-text">
          Compliant with<br></br>Privacy Laws(CCPA)
        </div>
        <div className="sub-sub-sub-text">
          Built hand-in-hand with<br></br>building managers
        </div>
        </section>
    </div>
  );
}
export default App;


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('home')
);

//serviceWorker.unregister();
