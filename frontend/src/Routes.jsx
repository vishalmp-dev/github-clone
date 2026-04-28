import React, {useEffect} from 'react'
import {useNavigate,useRoutes} from 'react-router-dom';

//pages list

import Dashboard from './components/Dashboard/Dashboard.jsx'
import UserProfile from './components/UserProfile/UserProfile.jsx'
import Login from "./components/Auth/Login.jsx"
import Signup from "./components/Auth/Signup.jsx"
import CreateRepo from "./components/Repos/CreateRepo.jsx";

import {useAuth} from "./authContext.jsx"

export default function Routes() {

 
  const navigate =  useNavigate();

  const { currentUser, setCurrentUser } = useAuth();

useEffect(() => {
  const userIdFromStorage = localStorage.getItem("userId");

  if (userIdFromStorage && !currentUser) {
    setCurrentUser(userIdFromStorage);
  }

  if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
    navigate("/auth");
  }

  if (userIdFromStorage && window.location.pathname === "/auth") {
    navigate("/");
  }
}, [currentUser, navigate, setCurrentUser]);


       let element = useRoutes([
     {
  path: "/",
  element: currentUser ? <Dashboard /> : <Login />
},
{
  path: "/auth",
  element: currentUser ? <Dashboard /> : <Login />
},
{
  path: "/signup",
  element: currentUser ? <Dashboard /> : <Signup />
},
        {
            path:"/profile",
            element:<UserProfile/>
        },
          {
    path: "/repo/create",
    element: <CreateRepo />
  }
    ]);

    return element;
}




