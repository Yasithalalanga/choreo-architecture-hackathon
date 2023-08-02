import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "@asgardeo/auth-react";
import 'semantic-ui-css/semantic.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider
      config={{
        signInRedirectURL: window.config.signInRedirectURL,
        signOutRedirectURL: window.config.signOutRedirectURL,
        clientID: window.config.clientId,
        baseUrl: window.config.asgardeoBaseURL,
        scope: window.config.appScopes.split(' '),
        resourceServerURLs: [window.config.residentsURL, window.config.scheduledVisitURL],
      }}
    > 
     <App />
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
