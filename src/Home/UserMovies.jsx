import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserMovies.css";
import editIcon from "../ImgUser/edit.png";       // Icon for "Edit"
import deleteIcon from "../ImgUser/delete.png";     // Icon for "Delete"

const TMDB_API_KEY = "023b16d3383a670d72a0da8eeb6de8f6";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const UserMovies = () => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingFavorites, setIsEditingFavorites] = useState(false);
  const [isEditingWatchlist, setIsEditingWatchlist] = useState(false);
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const watchlistRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMovies = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // Fetch current user.
        const userRes = await axios.get("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const uid = userRes.data.user._id;
        setUserId(uid);

        // Fetch the movie list for the user.
        const moviesRes = await axios.get(`http://localhost:8000/movies/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const favoritesIds = moviesRes.data.favorites || [];
        const watchlistIds = moviesRes.data.watchlist || [];

        // Fetch details for each favorite movie from TMDB.
        const favoritesDetails = await Promise.all(
          favoritesIds.map((movieId) =>
            axios
              .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                params: { api_key: TMDB_API_KEY },
              })
              .then((res) => res.data)
              .catch(() => null)
          )
        );
        setFavorites(favoritesDetails.filter(Boolean));

        // Fetch details for each watchlist movie from TMDB.
        const watchlistDetails = await Promise.all(
          watchlistIds.map((movieId) =>
            axios
              .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                params: { api_key: TMDB_API_KEY },
              })
              .then((res) => res.data)
              .catch(() => null)
          )
        );
        setWatchlist(watchlistDetails.filter(Boolean));
      } catch (error) {
        console.error("Error fetching user movies:", error);
        toast.error("Error fetching user movies");
      } finally {
        setLoading(false);
      }
    };

    fetchUserMovies();
  }, []);

  // Scroll to the watchlist section if URL hash is #watchlist
  useEffect(() => {
    if (window.location.hash === "#watchlist" && watchlistRef.current) {
      watchlistRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  // Close editing mode if clicking outside the container.
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsEditingFavorites(false);
        setIsEditingWatchlist(false);
        setSelectedFavorites([]);
        setSelectedWatchlist([]);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Handlers for checkbox changes.
  const handleCheckboxChangeFavorites = (movieId, checked) => {
    if (checked) {
      setSelectedFavorites((prev) => [...prev, movieId]);
    } else {
      setSelectedFavorites((prev) => prev.filter((id) => id !== movieId));
    }
  };

  const handleCheckboxChangeWatchlist = (movieId, checked) => {
    if (checked) {
      setSelectedWatchlist((prev) => [...prev, movieId]);
    } else {
      setSelectedWatchlist((prev) => prev.filter((id) => id !== movieId));
    }
  };

  // Toggle edit mode for Favorites.
  const toggleEditFavorites = async () => {
    if (!isEditingFavorites) {
      setIsEditingFavorites(true);
    } else {
      // If in editing mode and some movies are selected, delete them.
      if (selectedFavorites.length > 0) {
        try {
          const token = localStorage.getItem("accessToken");
          for (const movieId of selectedFavorites) {
            await axios.delete(`http://localhost:8000/movies/${userId}/list/favorites/${movieId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
          setFavorites((prev) =>
            prev.filter((movie) => !selectedFavorites.includes(String(movie.id)))
          );
          toast.success("Selected favorites removed");
        } catch (error) {
          console.error("Error deleting selected favorites:", error);
          toast.error("Error deleting selected favorites");
        }
      }
      setIsEditingFavorites(false);
      setSelectedFavorites([]);
    }
  };

  // Toggle edit mode for Watchlist.
  const toggleEditWatchlist = async () => {
    if (!isEditingWatchlist) {
      setIsEditingWatchlist(true);
    } else {
      if (selectedWatchlist.length > 0) {
        try {
          const token = localStorage.getItem("accessToken");
          for (const movieId of selectedWatchlist) {
            await axios.delete(`http://localhost:8000/movies/${userId}/list/watchlist/${movieId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
          setWatchlist((prev) =>
            prev.filter((movie) => !selectedWatchlist.includes(String(movie.id)))
          );
          toast.success("Selected watchlist movies removed");
        } catch (error) {
          console.error("Error deleting selected watchlist movies:", error);
          toast.error("Error deleting selected watchlist movies");
        }
      }
      setIsEditingWatchlist(false);
      setSelectedWatchlist([]);
    }
  };

  if (loading) {
    return <div className="user-movies">Loading...</div>;
  }

  return (
    <div className="user-movies-body" ref={containerRef}>
      <div className="user-movies">
        <div className="section-header">
          <h2>Your Favorites</h2>
          <img
            src={isEditingFavorites ? deleteIcon : editIcon}
            alt={isEditingFavorites ? "Stop Editing" : "Edit Favorites"}
            className="section-edit-icon"
            onClick={toggleEditFavorites}
          />
        </div>
        <div className="user-movies-grid">
          {favorites.length > 0 ? (
            favorites.map((movie) => (
              <div
                key={movie.id}
                className="user-movie-item"
                onClick={() => navigate(`/watch/${movie.id}`)}
              >
                <div className="movie-image-container">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_BASE_URL}${movie.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={movie.title}
                  />
                  {isEditingFavorites && (
                    <div
                      className="checkbox-overlay"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="movie-checkbox"
                        onChange={(e) =>
                          handleCheckboxChangeFavorites(String(movie.id), e.target.checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
                <p>{movie.title}</p>
              </div>
            ))
          ) : (
            <p>No favorites found.</p>
          )}
        </div>
      </div>

      <div className="user-movies" id="watchlist" ref={watchlistRef}>
        <div className="section-header">
          <h2>Your Watchlist</h2>
          <img
            src={isEditingWatchlist ? deleteIcon : editIcon}
            alt={isEditingWatchlist ? "Stop Editing" : "Edit Watchlist"}
            className="section-edit-icon"
            onClick={toggleEditWatchlist}
          />
        </div>
        <div className="user-movies-grid">
          {watchlist.length > 0 ? (
            watchlist.map((movie) => (
              <div
                key={movie.id}
                className="user-movie-item"
                onClick={() => navigate(`/watch/${movie.id}`)}
              >
                <div className="movie-image-container">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_BASE_URL}${movie.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={movie.title}
                  />
                  {isEditingWatchlist && (
                    <div
                      className="checkbox-overlay"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="movie-checkbox"
                        onChange={(e) =>
                          handleCheckboxChangeWatchlist(String(movie.id), e.target.checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
                <p>{movie.title}</p>
              </div>
            ))
          ) : (
            <p>No watchlist found.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserMovies;
