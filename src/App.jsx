// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlackHoleEffect from "./Components/User-Interface"; // Main homepage effect
import Signup from "./Components/Signup"; // Signup page component
import Login from "./Components/Login"; // Login page component
import Insights from "./Components/Insights"; // Terms & Conditions component
import Manifesto from "./Components/Manifesto"; // Manifesto component
import ForgotPassword from "./Components/RecoverAc";
import NotFound from "./Components/NotFound";
import Home from "./Home/Home";
import Watch from "./Home/Watch";
import ProtectedData from "./Components/Protected"; // Import the ProtectedRoute component
import ProtectedRoute from "./Components/Protected"; // Import your new ProtectedRoute
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import CustomCursor from "./Components/CustomCursor";
import UserPage from "./Components/User";
import UserMovies from "./Home/UserMovies";
import HelpPage from "./Home/Help";
import AboutUs from "./Components/About";
import Terms from "./Components/Guidelines";
import Privacy from "./Components/Privacy";
import ContactUs from "./Components/ContactUs";

function App() {
  return (
    <Router>
      <div className="App">
        <CustomCursor />
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{ backgroundColor: '#1f1f1f', color: 'wheat' }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<BlackHoleEffect />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Recover-Account" element={<ForgotPassword />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/User" element={<UserPage />} />
          <Route path="/UserMovies" element={<UserMovies />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch/:id"
            element={
              <ProtectedRoute>
                <Watch />
              </ProtectedRoute>
            }
          />
          <Route path="/protected" element={<ProtectedData />} />

          {/* Fallback Route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
