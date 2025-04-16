import { Link } from "react-router-dom";
import "../Styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-body">
        <div className="not-found">
        <div className="overlay">
            <h1>404</h1>
            <p>Oops! The page you are looking for cannot be found.</p>
            <Link to="/" className="home-link">Return Home</Link>
        </div>
        </div>
    </div>
  );
};

export default NotFound;
