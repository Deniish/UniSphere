import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import likeIcon from "../ImgUser/like.png";       // Icon for "Add to Your Favorites"
import likedIcon from "../ImgUser/heart.png";      // Icon for "Added to Your Favorites"
import watchlistIcon from "../ImgUser/add-list.png"; // Icon for "Add to Your Watchlist"
import addedWatchlistIcon from "../ImgUser/check.png"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Watch.css";

const API_KEY = "023b16d3383a670d72a0da8eeb6de8f6";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const DUMMY_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4"; // Dummy video URL

const dummyMovie = {
  title: "Dummy Movie",
  poster_path: "/dummy.jpg", // You may create a dummy image or use a placeholder URL.
  overview: "This is a dummy overview for a movie. It is shown because the movie data could not be fetched.",
  genres: [{ name: "Action" }, { name: "Adventure" }],
  credits: {
    cast: [{ name: "John Doe" }, { name: "Jane Doe" }, { name: "Actor 3" }]
  }
};

const Watch = () => {
  const { id } = useParams(); // Movie ID from URL
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]); // Movie IDs in Favorites (as strings)
  const [watchlist, setWatchlist] = useState([]); // Movie IDs in Watchlist (as strings)

  // Ref for video container.
  const videoWrapperRef = useRef(null);

  // Fetch movie details.
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: API_KEY,
              append_to_response: "credits,videos",
            },
          }
        );
        // If response data is empty, use dummy data.
        if (!response.data || Object.keys(response.data).length === 0) {
          setMovie(dummyMovie);
        } else {
          setMovie(response.data);
          // Find a trailer video from the results.
          if (
            response.data.videos &&
            response.data.videos.results &&
            response.data.videos.results.length > 0
          ) {
            const trailerVideo = response.data.videos.results.find(
              (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            );
            setTrailer(trailerVideo);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        // On error, set dummy data.
        setMovie(dummyMovie);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Fetch current user.
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch favorites and watchlist when currentUser is set.
  useEffect(() => {
    const fetchUserLists = async () => {
      if (!currentUser) return;
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://localhost:8000/movies/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure the movie IDs are strings.
        setFavorites((res.data.favorites || []).map(String));
        setWatchlist((res.data.watchlist || []).map(String));
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    fetchUserLists();
  }, [currentUser]);

  // Function to handle "Watch Now" – add to continue watching and launch fullscreen.
  const handleWatchNow = useCallback(() => {
    if (movie && currentUser) {
      const movieIdStr = String(movie.id);
      const token = localStorage.getItem("accessToken");
      const movieData = { movieId: movieIdStr, progress: 0 };
  
      // Add to continue watching list
      axios
        .post(
          `http://localhost:8000/movies/${currentUser._id}/list/continueWatching`,
          movieData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          console.log("Movie added to continue watching list:", response.data);
        })
        .catch((error) => {
          console.error("Error saving movie to continue watching:", error);
        });
  
      // Also add to watch history
      axios
        .post(
          `http://localhost:8000/movies/${currentUser._id}/list/watchHistory`,
          { movieId: movieIdStr },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          console.log("Movie added to watch history:", response.data);
        })
        .catch((error) => {
          console.error("Error saving movie to watch history:", error);
        });
    }
  
    // Launch fullscreen mode.
    if (videoWrapperRef.current) {
      if (videoWrapperRef.current.requestFullscreen) {
        videoWrapperRef.current.requestFullscreen();
      } else if (videoWrapperRef.current.webkitRequestFullscreen) {
        videoWrapperRef.current.webkitRequestFullscreen();
      } else if (videoWrapperRef.current.msRequestFullscreen) {
        videoWrapperRef.current.msRequestFullscreen();
      }
    }
  }, [movie, currentUser]);
  

  // Function to toggle favorite.
  const toggleFavorite = async (movieId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!currentUser) return;
      const movieIdStr = String(movieId);
      if (favorites.includes(movieIdStr)) {
        await axios.delete(`http://localhost:8000/movies/${currentUser._id}/list/favorites/${movieIdStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((id) => id !== movieIdStr));
        toast.success("Removed from your Favorites");
      } else {
        await axios.post(
          `http://localhost:8000/movies/${currentUser._id}/list/favorites`,
          { movieId: movieIdStr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites((prev) => [...prev, movieIdStr]);
        toast.success("Added to your Favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Function to toggle watchlist.
  const toggleWatchlist = async (movieId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!currentUser) return;
      const movieIdStr = String(movieId);
      if (watchlist.includes(movieIdStr)) {
        await axios.delete(`http://localhost:8000/movies/${currentUser._id}/list/watchlist/${movieIdStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist((prev) => prev.filter((id) => id !== movieIdStr));
        toast.success("Removed from your Watchlist");
      } else {
        await axios.post(
          `http://localhost:8000/movies/${currentUser._id}/list/watchlist`,
          { movieId: movieIdStr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWatchlist((prev) => [...prev, movieIdStr]);
        toast.success("Added to your Watchlist");
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  // Add keydown listener for "F" key to launch watch now.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "f") {
        handleWatchNow();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleWatchNow]);

  if (loading) {
    return <div className="watch-container">Loading...</div>;
  }

  return (
    <div className="Watch-Component Watch-grain-effect">
      <div className="watch-background">
        <div className="watch-container">
          <h1 className="video-title">{movie.title}</h1>
          {currentUser && (
            <p className="current-user">
              Logged in as: {currentUser.username || currentUser.email}
            </p>
          )}
          <div className="movie-media">
            <img
              src={
                movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : "placeholder.jpg"
              }
              alt={movie.title}
              className="movie-poster"
            />
            <div className="video-wrapper" ref={videoWrapperRef}>
              {trailer ? (
                <iframe
                  title="Trailer"
                  className="video-player"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&loop=1&playlist=${trailer.key}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video className="video-player" controls autoPlay loop>
                  <source src={DUMMY_VIDEO_URL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
          {/* Action buttons container */}
          <div className="action-buttons">
            <div className="watch-now-container">
              <button className="watch-button" onClick={handleWatchNow}>
                <span className="default-text">Watch Now</span>
                <span className="hover-text">Feel Now</span>
              </button>
            </div>
            <button
              className="favorites-button"
              onClick={() => toggleFavorite(movie.id)}
              title={
                favorites.includes(String(movie.id))
                  ? "Added to Your Favorites"
                  : "Add to Your Favorites"
              }
            >
              <img
                src={
                  favorites.includes(String(movie.id))
                    ? likedIcon
                    : likeIcon
                }
                alt={
                  favorites.includes(String(movie.id))
                    ? "Added to Your Favorites"
                    : "Add to Your Favorites"
                }
              />
            </button>
            <button
              className="watchlist-button"
              onClick={() => toggleWatchlist(movie.id)}
              title={
                watchlist.includes(String(movie.id))
                  ? "Added to Your Watchlist"
                  : "Add to Your Watchlist"
              }
            >
              <img
                src={
                  watchlist.includes(String(movie.id))
                    ? addedWatchlistIcon
                    : watchlistIcon
                }
                alt={
                  watchlist.includes(String(movie.id))
                    ? "Added to Your Watchlist"
                    : "Add to Your Watchlist"
                }
              />
            </button>
          </div>
          <div className="movie-details">
            <p className="overview">{movie.overview}</p>
            <p className="genres">
              <strong>Genres:</strong>{" "}
              {movie.genres && movie.genres.length > 0
                ? movie.genres.map((g) => g.name).join(", ")
                : "N/A"}
            </p>
            <p className="cast">
              <strong>Cast:</strong>{" "}
              {movie.credits &&
              movie.credits.cast &&
              movie.credits.cast.length > 0
                ? movie.credits.cast.slice(0, 5).map((member) => member.name).join(", ")
                : "N/A"}
            </p>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
