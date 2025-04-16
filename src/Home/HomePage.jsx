import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moreIcon from "../ImgUser/more.png";
import likeIcon from "../ImgUser/like.png";       // Icon for "Add to Your Favorites"
import likedIcon from "../ImgUser/heart.png";      // Icon for "Added to Your Favorites"
import watchlistIcon from "../ImgUser/add-list.png"; // Icon for "Add to Your Watchlist"
import addedWatchlistIcon from "../ImgUser/check.png"; 
import removeIcon from "../ImgUser/close.png";      // Icon for "Remove from Row"
import "./HomePage.css";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "023b16d3383a670d72a0da8eeb6de8f6";

const ContentRow = ({ category, genreId, genreName }) => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null); // store current user's id
  const [favorites, setFavorites] = useState([]); // store IDs of favorites
  const [watchlist, setWatchlist] = useState([]); // store IDs of watchlist movies
  const itemsRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [popupItemId, setPopupItemId] = useState(null);
  const navigate = useNavigate();

  // Update arrow visibility based on scroll position.
  const updateArrowVisibility = () => {
    if (itemsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = itemsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }
  };

  // Scroll functions for arrow buttons.
  const scrollLeft = () => {
    if (itemsRef.current) {
      itemsRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setTimeout(updateArrowVisibility, 500);
    }
  };

  const scrollRight = () => {
    if (itemsRef.current) {
      itemsRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setTimeout(updateArrowVisibility, 500);
    }
  };

  // Remove movie from continueWatching list.
  const removeFromContinue = async (movieId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!userId) return;
      const movieIdStr = String(movieId);
      await axios.delete(
        `http://localhost:8000/movies/${userId}/list/continueWatching/${movieIdStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove from local state.
      setItems((prevItems) =>
        prevItems.filter((item) => String(item.id) !== movieIdStr)
      );
      toast.success("Removed from Continue Watching Row");
    } catch (error) {
      console.error("Error removing movie from continue watching:", error);
      toast.error("Error removing movie from Continue Watching");
    }
  };

  // Fetch data based on category.
  useEffect(() => {
    const fetchData = async () => {
      if (category === "continue") {
        try {
          const token = localStorage.getItem("accessToken");
          // Fetch current user.
          const currentUserRes = await axios.get("http://localhost:8000/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const id = currentUserRes.data.user._id;
          setUserId(id);

          // Fetch the movie list document for this user.
          const movieListRes = await axios.get(`http://localhost:8000/movies/${id}`);
          const continueIds = movieListRes.data.continueWatching
            ? movieListRes.data.continueWatching.map((entry) => entry.movie)
            : [];
          const moviesDetails = await Promise.all(
            continueIds.map((movieId) =>
              axios
                .get(`${BASE_URL}/movie/${movieId}`, {
                  params: { api_key: TMDB_API_KEY },
                })
                .then((res) => res.data)
            )
          );
          setItems(moviesDetails.reverse());
        } catch (error) {
          console.error("Error fetching continue watching list from backend:", error);
          setItems([]);
        }
        return;
      }
      // For other categories, use existing logic...
      if (category === "movies") {
        let endpoint = `${BASE_URL}/discover/movie`;
        const params = { api_key: TMDB_API_KEY };
        if (genreId !== 0) params.with_genres = genreId;
        try {
          const response = await axios.get(endpoint, { params });
          if (response.data.results?.length) {
            setItems(response.data.results);
          } else {
            const fallbackResponse = await axios.get(`${BASE_URL}/movie/popular`, {
              params: { api_key: TMDB_API_KEY },
            });
            setItems(fallbackResponse.data.results);
          }
        } catch (error) {
          console.error(`Error fetching movies (${genreName}):`, error);
        }
      } else if (category === "series") {
        const endpoint = `${BASE_URL}/tv/popular`;
        const params = { api_key: TMDB_API_KEY };
        try {
          const response = await axios.get(endpoint, { params });
          setItems(response.data.results || []);
        } catch (error) {
          console.error(`Error fetching TV series (${genreName}):`, error);
        }
      } else if (category === "webseries") {
        const endpoint = `${BASE_URL}/discover/tv`;
        const params = { api_key: TMDB_API_KEY, with_networks: "213", sort_by: "popularity.desc", page: 1 };
        try {
          const response = await axios.get(endpoint, { params });
          setItems(response.data.results || []);
        } catch (error) {
          console.error("Error fetching web series data from TMDB:", error);
          setItems([]);
        }
      } else if (category === "anime") {
        try {
          const response = await axios.get("https://api.jikan.moe/v4/top/anime");
          setItems(response.data.data);
        } catch (error) {
          console.error("Error fetching anime:", error);
        }
      } else if (category === "books") {
        try {
          const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
            params: { q: "subject:fiction", maxResults: 10 },
          });
          setItems(response.data.items);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      } else if (
        ["topick", "likes", "top10india", "top10world", "bollywood", "hollywood", "south", "regional"].includes(category)
      ) {
        let endpoint = `${BASE_URL}/discover/movie`;
        const params = { api_key: TMDB_API_KEY, page: 1, sort_by: "popularity.desc" };
        if (category === "topick") {
          endpoint = `${BASE_URL}/movie/popular`;
        } else if (category === "likes") {
          endpoint = `${BASE_URL}/movie/top_rated`;
        } else if (category === "top10india") {
          params.with_origin_country = "IN";
        } else if (category === "top10world") {
          endpoint = `${BASE_URL}/movie/top_rated`;
        } else if (category === "bollywood") {
          params.with_original_language = "hi";
        } else if (category === "hollywood") {
          params.with_original_language = "en";
        } else if (category === "south") {
          params.with_original_language = "ta";
        } else if (category === "regional") {
          params.with_original_language = "gu";
        }
        try {
          const response = await axios.get(endpoint, { params });
          setItems(response.data.results || []);
        } catch (error) {
          console.error(`Error fetching ${category} data from TMDB:`, error);
          setItems([]);
        }
      } else {
        const dummyItems = Array.from({ length: 10 }, (_, i) => ({
          id: i,
          poster_path: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
          title: `Item ${i + 1}`,
        }));
        setItems(dummyItems);
      }
    };

    fetchData();
  }, [category, genreId, genreName]);

  useEffect(() => {
    updateArrowVisibility();
  }, [items]);

  // Close popup when clicking outside.
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (
        popupItemId &&
        !e.target.closest(".popup-bar") &&
        !e.target.closest(".continue-icon")
      ) {
        setPopupItemId(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [popupItemId]);

  // Function to toggle favorite (Add/Remove from Favorites).
  const toggleFavorite = async (movieId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!userId) return;
      const movieIdStr = String(movieId);
      if (favorites.includes(movieIdStr)) {
        // Remove from favorites.
        await axios.delete(`http://localhost:8000/movies/${userId}/list/favorites/${movieIdStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((id) => id !== movieIdStr));
        toast.success("Removed from your Favorites");
      } else {
        // Add to favorites.
        await axios.post(
          `http://localhost:8000/movies/${userId}/list/favorites`,
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

  // Function to toggle watchlist (Add/Remove from Watchlist).
  const toggleWatchlist = async (movieId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!userId) return;
      const movieIdStr = String(movieId);
      if (watchlist.includes(movieIdStr)) {
        // Remove from watchlist.
        await axios.delete(`http://localhost:8000/movies/${userId}/list/watchlist/${movieIdStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist((prev) => prev.filter((id) => id !== movieIdStr));
        toast.success("Removed from your Watchlist");
      } else {
        // Add to watchlist.
        await axios.post(
          `http://localhost:8000/movies/${userId}/list/watchlist`,
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

  // Fetch current favorites once userId is set.
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://localhost:8000/movies/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data.favorites || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [userId]);

  // Fetch current watchlist once userId is set.
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://localhost:8000/movies/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data.watchlist || []);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };
    fetchWatchlist();
  }, [userId]);

  return (
    <div className="content-row">
      <div className="content-row__container">
        {showLeftArrow && (
          <button className="scroll-button left" onClick={scrollLeft}>
            <img src="/Icons/left-arrow.png" alt="Scroll Left" />
          </button>
        )}
        <div
          className="content-row__items"
          ref={itemsRef}
          onScroll={updateArrowVisibility}
        >
          {items && items.length > 0 ? (
            items.map((item) => {
              let imageSrc = "";
              let itemTitle = "";
              if (["movies", "series", "continue"].includes(category)) {
                imageSrc = item.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : "https://image.shutterstock.com/z/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg";
                itemTitle = item.title || item.name;
              } else if (category === "webseries") {
                imageSrc = item.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : "https://image.shutterstock.com/z/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg";
                itemTitle = item.name || item.title;
              } else if (category === "anime") {
                imageSrc =
                  item.images?.jpg?.image_url ||
                  "https://image.shutterstock.com/z/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg";
                itemTitle = item.title;
              } else if (category === "books") {
                imageSrc =
                  item.volumeInfo?.imageLinks?.thumbnail ||
                  "https://image.shutterstock.com/z/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg";
                itemTitle = item.volumeInfo?.title;
              } else if (
                ["topick", "likes", "top10india", "top10world", "bollywood", "hollywood", "south", "regional"].includes(category)
              ) {
                imageSrc = item.poster_path
                  ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                  : "https://image.shutterstock.com/z/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg";
                itemTitle = item.title;
              } else {
                imageSrc = item.poster_path;
                itemTitle = item.title;
              }
              return (
                <div
                  key={item.id}
                  className="content-row__item"
                  onClick={() => navigate(`/watch/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="image-container">
                    <img
                      src={imageSrc}
                      alt={itemTitle}
                      className={`content-row__image ${
                        popupItemId === item.id ? "hidden" : ""
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://image.shutterstock.com/z/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg";
                      }}
                    />
                    {category === "continue" && (
                      <>
                        <img
                          src={moreIcon}
                          alt="More Options"
                          className="continue-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPopupItemId((prevId) =>
                              prevId === item.id ? null : item.id
                            );
                          }}
                        />
                        {popupItemId === item.id && (
                          <div className="popup-bar">
                            <ul>
                              <li
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(item.id);
                                  setTimeout(() => setPopupItemId(null), 2000);
                                }}
                              >
                                <img
                                  src={
                                    favorites.includes(String(item.id))
                                      ? likedIcon
                                      : likeIcon
                                  }
                                  alt={
                                    favorites.includes(String(item.id))
                                      ? "Added to Your Favorites"
                                      : "Add to Your Favorites"
                                  }
                                />
                                {favorites.includes(String(item.id))
                                  ? "Added to Your Favorites"
                                  : "Add to Your Favorites"}
                              </li>
                              <li
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWatchlist(item.id);
                                  setTimeout(() => setPopupItemId(null), 2000);
                                }}
                              >
                                <img
                                  src={
                                    watchlist.includes(String(item.id))
                                      ? addedWatchlistIcon
                                      : watchlistIcon
                                  }
                                  alt={
                                    watchlist.includes(String(item.id))
                                      ? "Added to Your Watchlist"
                                      : "Add to Your Watchlist"
                                  }
                                />
                                {watchlist.includes(String(item.id))
                                  ? "Added to Your Watchlist"
                                  : "Add to Your Watchlist"}
                              </li>
                              <li
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Remove from continue watching list.
                                  removeFromContinue(item.id);
                                  setTimeout(() => setPopupItemId(null), 2000);
                                }}
                              >
                                <img src={removeIcon} alt="Remove from Row" />
                                Remove from Row
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <p className="content-row__title">{itemTitle}</p>
                </div>
              );
            })
          ) : (
            <p>No items found.😥</p>
          )}
        </div>
        {showRightArrow && (
          <button className="scroll-button right" onClick={scrollRight}>
            <img src="/Icons/right-arrow.png" alt="Scroll Right" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentRow;
