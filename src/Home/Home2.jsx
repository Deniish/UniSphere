import React, { useState } from 'react';
import ContentRow from './HomePage';  // Ensure this path is correct
import './HomePage.css';

// Updated genre list: default option now has name "Categories"
const genres = [
  { id: 0, name: 'Categories' },
  { id: 28, name: 'Action' },
  { id: 53, name: 'Thriller' },
  { id: 35, name: 'Comedy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Science-Fiction' },
  { id: 9648, name: 'Mystery' },
  { id: 12, name: 'Adventure' },
  { id: 10749, name: 'Romance' },
  // Add additional genres as appropriate
];

const categories = ['movies', 'series']; // anime and books would require separate endpoints

function Home2() {
  // Default selection is the default option (id: 0)
  const [selectedGenreId, setSelectedGenreId] = useState(0);

  const handleGenreChange = (event) => {
    setSelectedGenreId(parseInt(event.target.value, 10));
  };

  // Find the selected genre object. In case nothing is found (shouldn't happen), fallback to a default
  const selectedGenre = genres.find((genre) => genre.id === selectedGenreId) || { name: 'Categories' };

  // For the header, if the default is selected, show "All" instead of "Categories"
  const displayGenre = selectedGenreId === 0 ? 'All' : selectedGenre.name;

  return (
    <div className="HomePage">
      <header className="app-header">
        <h1>My Netflix Clone</h1>
      </header>

      {/* Video Section */}
      <section className="video-section">
        <video
          src="your-video-url.mp4"  // Replace with your actual video URL or path
          autoPlay
          loop
          muted
          playsInline
          className="autoplay-video"
        />
      </section>

      {/* Genre Select Box */}
      <div className="genre-select-box">
        <label htmlFor="genre-select">Genre: </label>
        <select
          id="genre-select"
          value={selectedGenreId}
          onChange={handleGenreChange}
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <main>
        {categories.map((category) => (
          <section key={category} className="category-section">
            <h2 className="category-title">
              {category.toUpperCase()} - {displayGenre}
            </h2>
            <ContentRow
              key={`${category}-${selectedGenreId}`}
              category={category}
              genreId={selectedGenreId}
              genreName={displayGenre}
            />
          </section>
        ))}
      </main>
    </div>
  );
}

export default Home2;
