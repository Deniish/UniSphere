import React from "react";
 
const MovieCard = ({ movie: { imdbID, Year, Poster, Title, Type } }) => {
    return (
      <div className="movie" key={imdbID}>
        <div>
          <p>{Year}</p>
        </div>
  
        <div className="movie-poster">
          <img 
            src={Poster !== "N/A" ? Poster : "https://image.shutterstock.com/z/stock-vector-no-image-available-photo-coming-soon-illustration-vector-2059817444.jpg"} 
            alt={Title} 
            style={Poster === "N/A" ? { border: "2px dashed #ccc",width: "20vw",height: "50vh", padding: "10px", backgroundColor: "#f5f5f5" } : {}}
          />
        </div>

  
        <div className="movie-card">
          <span>{Type}</span>
          <h3>{Title}</h3>
        </div>
      </div>
    );
  }
 
export default MovieCard;