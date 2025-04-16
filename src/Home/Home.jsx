import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import ContentRow from "./HomePage"; // Ensure this path is correct
import HomeNavbar from "./HomeNavbar";
import MovieCard from "../Components/MovieCard";
import ToggleSwitch from "../Components/LightBulb";
import ReactMarkdown from 'react-markdown';
import Profile from "./Profile";


// --- Video & Thumbnail Data ---
const videos = [
  "./videos/v1.mp4",
  "./videos/v2.mp4",
  "./videos/v3.mp4",
  "./videos/v4.mp4",
  "./videos/v5.mp4",
  "./videos/v6.mp4",
];

const thumbnails = [
  "./Icons/bb1.jpg",
  "./Icons/oh.jpg",
  "./Icons/himm1.jpg",
  "./Icons/st.jpg",
  "./Icons/aot1.jpg",
  "./Icons/yn.jpg",
];

const videoLabels = [
  "Breaking Bad",
  "OPPENHEIMER",
  "How I Met Your Mother",
  "Stranger Things",
  "Attack on Titan",
  "Your Name",
];

const videoTextClasses = [
  "bb-text",
  "oh-text",
  "himm-text",
  "st-text",
  "aot-text",
  "yn-text",
];

// --- Genre & Category Data ---
const genres = [
  { id: 0, name: "Categories" },
  { id: 28, name: "Action" },
  { id: 53, name: "Thriller" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science-Fiction" },
  { id: 9648, name: "Mystery" },
  { id: 12, name: "Adventure" },
  { id: 10749, name: "Romance" },
];

// Updated sectionsOrder including all sections
const sectionsOrder = [
  { key: "continue", label: "Continue Watching" },
  { key: "topick", label: "Todays Top Pick for You" },
  { key: "likes", label: "Based On Your Likes" },
  { key: "top10india", label: "Top 10 in India" },
  { key: "top10world", label: "Top 10 in World" },
  { key: "movies", label: "Movies" },
  { key: "bollywood", label: "Bollywood" },
  { key: "hollywood", label: "Hollywood" },
  { key: "south", label: "South" },
  { key: "regional", label: "Regional" },
  { key: "series", label: "TV Series" },
  { key: "webseries", label: "Web Series" },
  { key: "anime", label: "Anime" },
  { key: "books", label: "Books" },
];

// --- Chatbot API Configuration for Reccome ---
const CHATBOT_API_KEY = "AIzaSyDJw2w30R8mW-KlY8nVEuSPAT0Xtmyj9K8";
const CHATBOT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${CHATBOT_API_KEY}`;

const Home = () => {
  // --- Video & Scroll States ---
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const computedMuted = isScrolled ? true : isMuted;

  // --- Search State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const API_URL = "http://www.omdbapi.com/?apikey=cea13de2";

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchSubmitted(false);
      return;
    }
    setSearchSubmitted(true);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      if (data.Response === "True") {
        setSearchResults(data.Search);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSearchSubmitted(false);
  };

  // --- Video Playback & Scroll Effects ---
  const selectVideo = (index) => {
    setCurrentVideoIndex(index);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = computedMuted;
    }
  }, [computedMuted]);

  useEffect(() => {
    let scrollTimeout;
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop > 50) {
        setIsScrolled(true);
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      } else {
        setIsScrolled(false);
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play();
        }
      }
      container.classList.add("scrolling");
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        container.classList.remove("scrolling");
      }, 2000);
    };
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // --- Genre & Category State ---
  const [selectedGenreId, setSelectedGenreId] = useState(0);
  const handleGenreChange = (event) => {
    setSelectedGenreId(parseInt(event.target.value, 10));
  };

  const selectedGenre = genres.find((genre) => genre.id === selectedGenreId) || { name: "Categories" };
  const displayGenre = selectedGenreId === 0 ? "All" : selectedGenre.name;

  // Create refs for sections:
  const sectionRefs = {
    movies: useRef(null),
    series: useRef(null),
    webseries: useRef(null),
    anime: useRef(null),
    books: useRef(null),
    bollywood: useRef(null),
    hollywood: useRef(null),
    south: useRef(null),
    regional: useRef(null),
  };

  const scrollToSection = (sectionKey) => {
    if (sectionRefs[sectionKey] && sectionRefs[sectionKey].current) {
      sectionRefs[sectionKey].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // When a specific genre is selected, render only these sections:
  const sectionsToRender =
    displayGenre === "All"
      ? sectionsOrder
      : sectionsOrder.filter((section) =>
          ["movies", "series", "webseries", "anime", "books"].includes(section.key)
        );

  // --- Chatbot Integration for Reccome ---
  const [reccomeChat, setReccomeChat] = useState([]);
  const [isReccomeLoading, setIsReccomeLoading] = useState(false);
  
  const getChatResponse = async (message) => {
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      systemInstruction: {
        "role": "user",
        "parts": [
          {
            "text": "your name is Reccome; you’re a powerful recommendation bot for movies, series, anime and books. You recommend yourself and give the best suggestions based on ratings and reviews."
          }
        ]
      },
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
        responseMimeType: "text/plain",
      },
    };

    const response = await fetch(CHATBOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const handleReccomeQuery = async (query) => {
    // Add user query to reccomeChat
    setReccomeChat((prev) => [...prev, { role: "user", content: query }]);
    setIsReccomeLoading(true);
    try {
      const response = await getChatResponse(query);
      setReccomeChat((prev) => [...prev, { role: "bot", content: response }]);
    } catch (error) {
      console.error("Error in chatbot response:", error);
      setReccomeChat((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong." }]);
    } finally {
      setIsReccomeLoading(false);
    }
  };

  return (
    <div className="home-container" ref={containerRef}>
      {/* Video Background Section */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={computedMuted}
        playsInline
        className={`background-video ${isScrolled ? "fade-out" : ""}`}
        key={currentVideoIndex}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="pages-container">
        {/* Home Page Section: Video Thumbnails, Selectors, etc. */}
        <div className="home-page">
          <div className={`video-thumbnail-container ${isScrolled ? "fade-out" : ""}`}>
            <img
              src={thumbnails[currentVideoIndex]}
              alt={`Thumbnail ${currentVideoIndex + 1}`}
              className="video-thumbnail"
            />
          </div>
          <div className="video-selector">
            {videos.map((_, index) => (
              <button
                key={index}
                className={`video-selector-btn ${currentVideoIndex === index ? "active" : ""}`}
                onClick={() => selectVideo(index)}
              />
            ))}
          </div>
          <div className={`video-text-container ${isScrolled ? "fade-out" : ""}`}>
            <span className={`video-text ${videoTextClasses[currentVideoIndex]}`}>
              {videoLabels[currentVideoIndex]}
            </span>
          </div>
          <div className={`watch-button-container ${isScrolled ? "fade-out" : ""}`}>
            <a className="watch-button" href="/home">
              <span className="default-text">Watch Now</span>
              <span className="hover-text">Feel Now</span>
            </a>
          </div>
          <button onClick={toggleMute} className={`toggle-mute-btn ${isScrolled ? "fade-out" : ""}`}>
            {computedMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            )}
          </button>
        </div>
        <Profile />
        <h1 className="logo-home">
            UniSphere <img src="/Icons/icon2.png" alt="UniSphere Logo" className="unisphere-logo-login" />
          </h1>
        {/* Content Section */}
        <ToggleSwitch />
        <div className="content-section">
          <div className="genre-select-box">
            <label htmlFor="genre-select">Genre: </label>
            <select id="genre-select" value={selectedGenreId} onChange={handleGenreChange}>
              {genres.map((genre) => (
                <option className="genre-option" key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          
          <HomeNavbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            searchSubmitted={searchSubmitted}
            handleClearSearch={handleClearSearch}
            scrollToSection={scrollToSection}
            onReccome={handleReccomeQuery} // Pass the reccome chatbot handler
          />
          
          {/* Display Reccome (Chatbot) Section below Navbar */}
          
          {reccomeChat.length > 0 && (
          <div className="reccome-chat-container">
            <div className="reccome-chat-messages">
              {(() => {
                const chatPairs = [];
                // Group messages into pairs: user message, then bot message.
                for (let i = 0; i < reccomeChat.length; i++) {
                  if (reccomeChat[i].role === "user") {
                    const pair = [reccomeChat[i]];
                    // If the next message is a bot reply, add it to the pair.
                    if (i + 1 < reccomeChat.length && reccomeChat[i + 1].role === "bot") {
                      pair.push(reccomeChat[i + 1]);
                      i++; // Skip the bot message as it is already paired.
                    }
                    chatPairs.push(pair);
                  } else {
                    // If a bot message appears without a preceding user message.
                    chatPairs.push([reccomeChat[i]]);
                  }
                }
                // If the last pair contains only a user message and the bot is loading,
                // add a "typing" element to the pair.
                if (chatPairs.length > 0) {
                  const lastPair = chatPairs[chatPairs.length - 1];
                  if (lastPair.length === 1 && lastPair[0].role === "user" && isReccomeLoading) {
                    lastPair.push({ role: "typing", content: "" });
                  }
                }
                // Reverse the pairs so that the latest conversation appears first.
                chatPairs.reverse();

                return chatPairs.map((pair, index) => (
                  <div key={index} className="chat-pair">
                    {pair.map((msg, j) => {
                    if (msg.role === "typing") {
                      return (
                        <div key={j} className="message bot-message">
                          <div className="message-content typing-indicator">
                            <img src="/Icons/bot2.png" alt="Bot" className="Bot-indicator" />
                            <div className="typing-dot"></div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={j} className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
                        {msg.role === "bot" && (
                          <img src="/Icons/bot2.png" alt="Bot" className="Bot-indicator-message" />
                        )}
                        <div className="message-content">
                          {msg.role === "bot" ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  </div>
                ));
              })()}
            </div>
            <button
              className="clear-chat-button"
              onClick={() => setReccomeChat([])}
              title="Clear Chat"
            >
              <img src="/Icons/arrow-left.png" alt="Clear Chat" />
            </button>
          </div>
        )}



          
          
          
          {isLoading ? (
            <div className="search-output">
              <h2>
                Loading<span>...</span>
              </h2>
            </div>
          ) : searchSubmitted && searchResults.length === 0 ? (
            <div className="search-output">
              <h2>No Data Found😑</h2>
              <button className="back-home" onClick={handleClearSearch}>
                <img src="/Icons/arrow-left.png" alt="Back" />
              </button>
            </div>
          ) : (
            searchResults.length > 0 && (
              <div className="search-output">
                <h2>Search Results</h2>
                <div className="search-results-container">
                  {searchResults.map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} />
                  ))}
                </div>
                <button className="back-home" onClick={handleClearSearch}>
                  <img src="/Icons/arrow-left.png" alt="Back" />
                </button>
              </div>
            )
          )}
          <main>
            {sectionsToRender.map((section) => {
              const sectionTitle =
                displayGenre === "All"
                  ? section.label
                  : `${section.label} - ${displayGenre}`;
              return (
                <section
                  key={section.key}
                  className="category-section"
                  ref={
                    ["movies", "series", "webseries", "anime", "books", "bollywood", "hollywood", "south", "regional"].includes(section.key)
                      ? sectionRefs[section.key]
                      : null
                  }
                >
                  <h2 className="category-title">{sectionTitle}</h2>
                  <ContentRow
                    key={`${section.key}-${selectedGenreId}`}
                    category={section.key}
                    genreId={selectedGenreId}
                    genreName={displayGenre === "All" ? section.label : sectionTitle}
                  />
                </section>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
