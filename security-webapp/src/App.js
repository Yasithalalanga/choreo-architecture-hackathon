// import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthContext, SecureRoute } from "@asgardeo/auth-react";
import Schedules from './components/Schedules';
import VisitScheduler from './components/VisitScheduler';

// Main app component
const App = () => {
  
  // Define cart and add to cart variables to pass to the MyCart component
  const { state, signIn, signOut, getBasicUserInfo } = useAuthContext();
  const [loggedInUserDisplayValue, setLoggedInUserDisplay] = useState("")

  // Component to render the login/signup/logout menu
  const RightLoginSignupMenu = () => {
   
    // Based on Asgardeo SDK, set a variable like below to check and conditionally render the menu
    let isLoggedIn = state.isAuthenticated;

    // Host the menu content and return it at the end of the function
    let menu;
    // Conditionally render the Security app and Admin views based on whether the user is logged in or not
    if (isLoggedIn) {
      getBasicUserInfo().then((response) => {
        setLoggedInUserDisplay(response.email ? response.email : response.username);
      }).catch((error) => {
        console.error(error);
      });
      menu = (
        <Menu.Item position="right">
          <Menu.Item>
            <FontAwesomeIcon icon={faUser} />
            {loggedInUserDisplayValue}
          </Menu.Item>
          <Button primary onClick={handleSignOut}>
            Logout
          </Button>
        </Menu.Item>
      );
    } else {
      menu = (
        <Menu.Item position="right">
          {/* pass a callback function to signIn method */}
          <Button primary onClick={() => signIn()}>
            Login
          </Button>
        </Menu.Item>
      );
    }
    return menu;

    function handleSignOut() {
      signOut();
    }
  }

  // Component to render the navigation bar
  const WebAppNav = () => {
    return (
      <>
        <Menu inverted>
          <Container>
            <Menu.Item as="a" header href="/" >
              <div>
                <h3 style={{ margin: 0 }}>Lotus Groove</h3>
                <p style={{ margin: 0 }}>Security Gate Management System</p>
              </div>
            </Menu.Item>
            <Menu.Menu position="right">
              <RightLoginSignupMenu />
            </Menu.Menu>
          </Container>
        </Menu>
      </>
    );
  };

  useEffect(() => {
    document.title = 'LotusGroove';
  }, []);
  return (
    <>
     <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // Add the background image URL or import it and use as a URL value
          backgroundImage: `url('https://images.unsplash.com/photo-1521137874331-ddb581452091?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80')`, // Replace 'path/to/your/image.jpg' with the actual path to your image
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <BrowserRouter>
          <div style={{ flex: 1 }}>
            <WebAppNav />
            <Routes>
              <Route exact path="/">
              </Route>
              {/* <Route path="/schedule-visit" component={VisitScheduler} /> */}
            </Routes>
            <Schedules/>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
