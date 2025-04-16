import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/User.css";
import Statistics from "./ViewStatistics";
import edit from "../ImgUser/edit.png"; // Import the edit icon

const TMDB_API_KEY = "023b16d3383a670d72a0da8eeb6de8f6";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loadingWatchHistory, setLoadingWatchHistory] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const inputRef = useRef(null);
  const usernameContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch current user data.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Error fetching user details");
      }
    };

    fetchUser();
  }, []);

  // Fetch watch history once user data is available.
  useEffect(() => {
    if (!user) return;

    const fetchWatchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://localhost:8000/movies/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // The backend is expected to populate 'watchHistory' with movie objects.
        const fetchedWatchHistory = res.data.watchHistory || [];

        // If the items are not objects, then fetch details from TMDB.
        if (
          fetchedWatchHistory.length > 0 &&
          typeof fetchedWatchHistory[0] !== "object"
        ) {
          const watchHistoryDetails = await Promise.all(
            fetchedWatchHistory.map((movieId) =>
              axios
                .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                  params: { api_key: TMDB_API_KEY },
                })
                .then((res) => res.data)
                .catch(() => null)
            )
          );
          setWatchHistory(watchHistoryDetails.filter(Boolean));
        } else {
          setWatchHistory(fetchedWatchHistory);
        }
      } catch (error) {
        console.error("Error fetching watch history:", error);
        toast.error("Error fetching watch history");
      } finally {
        setLoadingWatchHistory(false);
      }
    };

    fetchWatchHistory();
  }, [user]);

  // Focus the input field when editing mode is enabled.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Cancel editing if a click happens outside the username container.
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e) => {
      if (
        usernameContainerRef.current &&
        !usernameContainerRef.current.contains(e.target)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  // Handler for clicking the edit icon.
  const handleEditUsername = () => {
    setNewUsername(user.username);
    setIsEditing(true);
  };

  // Handler for input changes.
  const handleInputChange = (e) => {
    setNewUsername(e.target.value);
  };

  // Function to update the username on the backend.
  const updateUsername = async () => {
    if (!newUsername.trim()) return; // Avoid updating to empty username
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        "http://localhost:8000/update-username",
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => ({ ...prev, username: newUsername }));
      toast.success("Username updated successfully");
    } catch (error) {
      console.error("Error updating username:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error updating username");
      }
    } finally {
      setIsEditing(false);
    }
  };

  // Trigger update when pressing Enter.
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateUsername();
    }
  };

  if (!user) {
    return <div className="user-page">Loading...</div>;
  }

  return (
    <div className="User-body">
      <div className="user-page">
        <div className="user-header">
          <h1>User Profile</h1>
          <div className="user-email">{user.email}</div>
        </div>

        <div className="user-card">
          <div className="user-image">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="User Profile" />
            ) : (
              <div className="user-placeholder">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <div className="username-container" ref={usernameContainerRef}>
              {isEditing ? (
                <input
                  type="text"
                  ref={inputRef}
                  value={newUsername}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="username-input"
                />
              ) : (
                <>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <img
                    src={edit}
                    alt="Edit Username"
                    className="edit-icon"
                    title="Edit Username"
                    onClick={handleEditUsername}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      
      {/* Watch History Section */}
      <div className="user-page-history">
        <div className="user-watch-history">
          <h2>Watch History</h2>
          {loadingWatchHistory ? (
            <p>Loading watch history...</p>
          ) : watchHistory.length > 0 ? (
            <div className="watch-history-grid">
              {watchHistory.map((movie) => (
                <div
                  key={movie.id}
                  className="watch-history-item"
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_BASE_URL}${movie.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={movie.title}
                  />
                  <p>{movie.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No watch history found.</p>
          )}
        </div>
      </div>
      <Statistics />
    </div>
  );
};

export default UserPage;
