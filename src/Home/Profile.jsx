import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import user from "../ImgUser/user.png";
import like from "../ImgUser/like.png";
import save from "../ImgUser/add-list.png";
import settings from "../ImgUser/settings.png";
import help from "../ImgUser/question.png";
import logout from "../ImgUser/log-out.png";
// import editIcon from "../ImgUser/edit.png"; 
import deleteIcon from "../ImgUser/delete.png"; // Delete icon for popup
import "./profile.css"; // Ensure this is linked

function Profile() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Predefined list of background colors.
  const randomColor = useMemo(() => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF6"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Fetch current user data from backend (/me endpoint)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/me", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setOpen(!open);
    if (open) {
      setShowSettingsPopup(false);
      setShowPasswordSection(false);
    }
  };

  // When Settings is clicked, toggle the settings popup.
  const handleSettingsClick = () => {
    setShowSettingsPopup((prev) => !prev);
    // Reset the password section when toggling settings popup.
    setShowPasswordSection(false);
  };

  // When "Delete Your Account" is clicked, show the password section inside the popup.
  const handleShowPasswordSection = () => {
    setShowPasswordSection(true);
  };

  // Handler for password input changes.
  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
  };

  // Function to verify password via backend before deletion.
  const verifyPasswordAndDelete = async () => {
    if (!passwordInput.trim()) {
      toast.error("Please enter your password.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      // Verify password (adjust endpoint as needed)
      const res = await fetch("http://localhost:8000/verify-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: passwordInput }),
      });
      const result = await res.json();
      if (res.ok && result.valid) {
        // If verified, ask for final confirmation.
        const confirmDelete = window.confirm(
          "Are you sure you want to delete your account?"
        );
        if (confirmDelete) {
          const deleteRes = await fetch("http://localhost:8000/delete-account", {
            method: "DELETE",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (deleteRes.ok) {
            toast.success("Your account has been deleted.");
            localStorage.removeItem("accessToken");
            setTimeout(() => navigate("/signup"), 2000);
          } else {
            toast.error("Failed to delete your account.");
          }
        }
      } else {
        toast.error("Password does not match. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      toast.error("An error occurred while verifying password.");
    } finally {
      setShowPasswordSection(false);
      setShowSettingsPopup(false);
      setOpen(false);
      setPasswordInput("");
    }
  };

  // Other click handlers for dropdown items.
  const handleMyProfile = () => {
    navigate("/User");
    setOpen(false);
  };

  const handleYourFavourites = () => {
    navigate("/UserMovies#favourites");
    setOpen(false);
  };

  const handleYourWatchlist = () => {
    navigate("/UserMovies#watchlist");
    setOpen(false);
  };

  const handleHelps = () => {
    navigate("/help");
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success("Logout successful");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    } finally {
      localStorage.removeItem("accessToken");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setOpen(false);
    }
  };

  // Close the dropdown if clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setShowSettingsPopup(false);
        setShowPasswordSection(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      {/* Trigger to open/close the dropdown */}
      <div className="menu-trigger" onClick={toggleDropdown}>
        {userData ? (
          <div
            className={`profile-placeholder ${open ? "active" : ""}`}
            style={{ backgroundColor: randomColor }}
          >
            {userData.username[0].toUpperCase()}
          </div>
        ) : (
          <img src="/path/to/default-image.png" alt="User Logo" />
        )}
      </div>

      {/* Dropdown menu */}
      <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
        <h3>
          {userData ? `Hello, ${userData.username}` : "Loading..."}<br />
        </h3>
        <ul>
          <DropdownItem img={user} text={"My Profile"} onClick={handleMyProfile} />
          <DropdownItem img={like} text={"Your Favourites"} onClick={handleYourFavourites} />
          <DropdownItem img={save} text={"Your Watchlist"} onClick={handleYourWatchlist} />
          <DropdownItem img={settings} text={"Settings"} onClick={handleSettingsClick} />
          {/* Settings popup */}
          {showSettingsPopup && (
            <div className="settings-popup">
              <ul>
                <li onClick={handleShowPasswordSection}>
                  <img src={deleteIcon} alt="Delete Account" className="popup-delete-icon" />
                  Delete Your Account
                </li>
              </ul>
              {showPasswordSection && (
                <div className="password-section">
                  <h4>Enter your password to confirm deletion</h4>
                  <input
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={handlePasswordChange}
                  />
                  <button onClick={verifyPasswordAndDelete}>Confirm</button>
                  <button
                    onClick={() => setShowPasswordSection(false)}
                    style={{ backgroundColor: "white", color: "black", border: "none"}}
                  >
                    Cancel
                  </button>

                </div>
              )}
            </div>
          )}
          <DropdownItem img={help} text={"Helps"} onClick={handleHelps} />
          <DropdownItem 
            img={logout} 
            text={"Logout"} 
            onClick={handleLogout} 
            className="logout-dropdown-item" 
          />

        </ul>
      </div>

      <ToastContainer 
        className="custom-toast-container-2"
        toastClassName="custom-toast"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

function DropdownItem({ img, text, onClick, className = "" }) {
  return (
    <li className={`dropdownItem ${className}`} onClick={onClick}>
    {img && <img src={img} alt={text} />}
    {/* <a href="#" onClick={(e) => e.preventDefault()}>
        {text}
      </a> */}
    <button 
      type="button" 
      className={`dropdown-link ${className}`}
      onClick={(e) => {
        e.preventDefault();
        // onClick();
      }}
    >
      {text}
    </button>
  </li>
  
  );
}

export default Profile;
