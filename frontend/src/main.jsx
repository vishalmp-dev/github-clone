import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from './authContext.jsx'
import Routes from "./Routes.jsx"
import { BrowserRouter as Router } from "react-router-dom"

createRoot(document.getElementById('root')).render(


 <AuthProvider>
  <Router>
  < Routes />
  </Router>
 </AuthProvider>

);
