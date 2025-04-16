import React, { useState, useEffect, useRef } from 'react';
import Footer from './Footer';
import '../Styles/Insights.css';

const Insights = () => {
  const [trendingIndia, setTrendingIndia] = useState([]);
  const [trendingWorld, setTrendingWorld] = useState([]);
  const TMDB_API_KEY = "023b16d3383a670d72a0da8eeb6de8f6";
  const [isToggled, setIsToggled] = useState(false);

  // Function to toggle the image source
  const handleSecondImageClick = () => {
    setIsToggled(prevState => !prevState);
  };
  const [animate, setAnimate] = useState(false);
  const [animate2, setAnimate2] = useState(false);
  const [animate3, setAnimate3] = useState(false);

  const handleClick = () => {
  setAnimate(true);
};

const handleAnimationEnd = () => {
  setAnimate(false);
};
  const handleClick2 = () => {
    setAnimate2(true);
  };

  const handleAnimationEnd2 = () => {
    setAnimate2(false);
  };

  const handleClick3 = () => {
    setAnimate3(true);
  };

  const handleAnimationEnd3 = () => {
    setAnimate3(false);
  };

  const [gridLayout, setGridLayout] = useState(false);
  const [collapseAnimation, setCollapseAnimation] = useState(false);
  const containerRef = useRef(null);

  // When the first image is clicked, change layout to grid
  const handleFirstImageClick = () => {
    setGridLayout(true);
  };
   // When the button is clicked, trigger the collapse animation.
   const handleCollapseClick = () => {
    if (gridLayout) {
      setCollapseAnimation(true);
      // Wait for collapse animation to finish before reverting to stacked view.
      setTimeout(() => {
        setGridLayout(false);
        setCollapseAnimation(false);
      }, 10); // Adjust time if necessary.
    }
  };



  const [testimonials] = useState([
    {
      id: 1,
      cardClass: 'testimonial-card-1',
      image: '/Photos/p1.jpeg',
      alt: 'User Testimonial',
      text: "UniSphere completely transformed my movie nights. Highly recommended!",
      author: "Olivia Benson"
    },
    {
      id: 2,
      cardClass: 'testimonial-card-2',
      image: '/Photos/p2.jpeg',
      alt: 'User Testimonial',
      text: "The recommendations are spot on and so diverse. I love it!",
      author: "Ethan Parker"
    },
    {
      id: 3,
      cardClass: 'testimonial-card-3',
      image: '/Photos/p3.jpeg',
      alt: 'User Testimonial',
      text: "UniSphere opened up a whole new world of entertainment for me. Every recommendation feels personally curated, turning my movie nights into unforgettable adventures!",
      author: "Alex Johnson"
    },
    {
      id: 4,
      cardClass: 'testimonial-card-2',
      image: '/Photos/p4.jpg',
      alt: 'User Testimonial',
      text: "The AI engine behind UniSphere truly understands my taste. It always surprises me with hidden gems I would have never discovered otherwise.",
      author: "Maria Garcia"
    },
    {
      id: 5,
      cardClass: 'testimonial-card-2',
      image: '/Photos/p5.jpg',
      alt: 'User Testimonial',
      text: "I've tried many streaming platforms, but UniSphere stands out with its accurate recommendations. It’s like having a personal entertainment concierge!",
      author: "Chris Lee"
    },
    {
      id: 6,
      cardClass: 'testimonial-card-1',
      image: '/Photos/p6.jpg',
      alt: 'User Testimonial',
      text: "UniSphere has completely transformed my viewing experience. Its seamless blend of AI and curated content makes every suggestion feel spot on.",
      author: "Samantha Brown"
    },
    {
      id: 7,
      cardClass: 'testimonial-card-4',
      image: '/Photos/p7.jpg',
      alt: 'User Testimonial',
      text: "From indie films to the latest blockbusters, UniSphere always provides the perfect pick for my mood. I couldn’t ask for a better recommendation engine!",
      author: "David Kim"
    }
  ]);

  const [positions, setPositions] = useState(() => {
    let initialPositions = {};
    testimonials.forEach((t, i) => {
      // Here we offset each card; you can adjust as needed.
      initialPositions[t.id] = { x: 20 + (i % 3) * 250, y: 20 + Math.floor(i / 3) * 200 };
    });
    return initialPositions;
  });

  // State to track the currently dragged card and its offset relative to the mouse pointer
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zIndexes, setZIndexes] = useState(() => {
    const initial = {};
    testimonials.forEach((t) => {
      initial[t.id] = 1;
    });
    return initial;
  });
  // When the user presses down on a card, record which card and the offset between
  // the pointer and the card's top-left corner.
  const handleMouseDown = (e, id) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const cardPos = positions[id];
    const offsetX = startX - cardPos.x;
    const offsetY = startY - cardPos.y;
    setDraggingId(id);
    setDragOffset({ x: offsetX, y: offsetY });
    setZIndexes(prev => {
        const maxZ = Math.max(...Object.values(prev));
        return { ...prev, [id]: maxZ + 1 };
      });
  };

  // Update the position of the card being dragged
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingId === null) return;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPositions(prev => ({
        ...prev,
        [draggingId]: { x: newX, y: newY }
      }));
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, dragOffset]);


  useEffect(() => {
    // Fetch popular movies in India using region parameter
    const fetchTrendingIndia = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&region=IN`);
        const data = await res.json();
        setTrendingIndia(data.results);
      } catch (error) {
        console.error('Error fetching trending India data:', error);
      }
    };

    // Fetch trending movies worldwide
    const fetchTrendingWorld = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`);
        const data = await res.json();
        setTrendingWorld(data.results);
      } catch (error) {
        console.error('Error fetching trending world data:', error);
      }
    };

    fetchTrendingIndia();
    fetchTrendingWorld();
  }, [TMDB_API_KEY]);

  return (
    <div className="insights-container">
      <main className="insights-main">
        <section className="insights-section whats-new">
          <h2>What's New in <br /><span> UniSphere</span></h2>
          <div className="icons-container-insights">
          <img
            src="/Icons/astronaut.png"
            alt="Icon 1"
            onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            className={animate ? "animate-icon" : ""}
          />
            <img 
              src={isToggled ? '/Icons/smile-face.png' : '/Icons/smile-light.png'} 
              alt="Icon 2" 
              onClick={handleSecondImageClick} 
            />
           <img
              src="/Icons/icon2.png"
              alt="Icon 3"
              onClick={handleClick2}
              onAnimationEnd={handleAnimationEnd2}
              className={animate2 ? "animate-icon2" : ""}
            />
           <img
              src="/Icons/icon5.png"
              alt="Icon 3"
              onClick={handleClick3}
              onAnimationEnd={handleAnimationEnd3}
              className={animate3 ? "animate-icon3" : ""}
            />
          </div>
          <div>
            {/* Button to trigger collapse animation */}
            {gridLayout && (
              <button
              onClick={handleCollapseClick}
              className="collapse-btn"
              style={{ marginBottom: '20px' }}
            >
              <img src="/Icons/close.png" alt="Collapse" />
              {/* <span className="content-ball"></span> */}
            </button>
            
            )}

            <div
              ref={containerRef}
              className={`image-stack-container 
                ${gridLayout ? 'grid-layout' : ''} 
                ${collapseAnimation ? 'collapse-layout' : ''}`}
            >
              <img
                src="/Photos/img60.jpeg"
                alt="New Feature 12"
                onClick={handleFirstImageClick}
                className="first-image"
              />
              <img src="/Photos/img7.jpg" alt="New Feature 2"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img27.jpeg" alt="New Feature 3"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img54.jpeg" alt="New Feature 4"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img57.jpeg" alt="New Feature 5"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img37.jpeg" alt="New Feature 6"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img40.jpeg" alt="New Feature 7"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img36.jpeg" alt="New Feature 8"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img49.jpeg" alt="New Feature 9"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img39.jpeg" alt="New Feature 10"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img53.jpeg" alt="New Feature 11"  onClick={handleFirstImageClick}/>
              <img src="/Photos/img51.jpeg" alt="New Feature 12"  onClick={handleFirstImageClick}/>
              {/* Add more images as needed */}
            </div>
          </div>
 

            {/* Left Side Black Container */}
            <div className="black-container">
            <div className="pink-container">
                <p>Discover Exciting Updates</p>
            </div>
            </div>
          <div className="marquee-container">
            <div className="marquee-text">
                {[
                "Stay updated with the latest features, updates, and improvements from UniSphere. ",
                "Stay updated with the latest features, updates, and improvements from UniSphere. ",
                "Stay updated with the latest features, updates, and improvements from UniSphere. ",
                "Stay updated with the latest features, updates, and improvements from UniSphere. "
                ].map((text, index) => (
                <p key={index} className="marquee-item">{text}</p>
                ))}
                {[
                "Stay updated with the latest features, updates, and improvements from UniSphere. ",
                "Stay updated with the latest features, updates, and improvements from UniSphere. ",
                "Stay updated with the latest features, updates, and improvements from UniSphere. ",
                "Stay updated with the latest features, updates, and improvements from UniSphere. "
                ].map((text, index) => (
                <p key={`dup-${index}`} className="marquee-item">{text}</p>
                ))}
            </div>
            </div>



        </section>

        <section className="insights-section trending">
        {/* Trending In India */}
        <div className="trending-subsection">
            <h2>Trending In India</h2>
            <p>
            Discover the most popular movies, series, animes, and books captivating audiences in India.
            </p>
            <div className="carousel-container">
            <div className="carousel-track">
                {trendingIndia.length > 0 ? (
                [...trendingIndia, ...trendingIndia].map((movie, index) => (
                    <div key={`${movie.id}-${index}`} className="movie-card-insights">
                    <img 
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                        alt={movie.title} 
                    />
                    </div>
                ))
                ) : (
                <p>Loading trending movies in India...</p>
                )}
            </div>
            </div>
        </div>

        {/* Trending In World */}
        <div className="trending-subsection">
        <h2>Trending In World</h2>
        <p>Explore global trends and find out what’s gaining popularity around the world.</p>

            <div className="carousel-container">
            <div className="carousel-track carousel-track-reverse">
                {trendingWorld.length > 0 ? (
                [...trendingWorld, ...trendingWorld].map((movie, index) => (
                    <div key={`${movie.id}-${index}`} className="movie-card-insights">
                    <img 
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                        alt={movie.title} 
                    />
                    </div>
                ))
                ) : (
                <p>Loading trending movies worldwide...</p>
                )}
            </div>
            </div>
        </div>
        </section>

        {/* <img src='/backgrounds/torn2.jpeg' alt='backgroundImage' className='tornpage' /> */}

        <section className="insights-section whats-reccome-ai">
        <h2>What's Reccome A.I.</h2>
        {/* Container wrapping both image and text box */}
        <div className="reccome-container">
            <div className="reccome-demo">
            <img src="/Photos/Chatbot.jpeg" alt="Reccome A.I. Demo" />
            </div>
            {/* Box container for Reccome A.I. content */}
            <div className="reccome-box">
            <div className="reccome-content reccome-right-box">
                <p>
                At UniSphere, our Reccome A.I. is the brain behind every personalized recommendation. Powered by state-of-the-art machine learning algorithms, it learns your unique tastes by analyzing your viewing habits, ratings, and subtle interaction patterns.
                </p>
                <p>
                Using a blend of collaborative filtering and content-based approaches, Reccome A.I. curates movies, series, animes, and books that are perfectly suited to your interests. It continuously adapts to your evolving preferences, ensuring that each recommendation is fresh, relevant, and exciting.
                </p>
                <p>
                Experience the difference as our intelligent engine helps you discover new favorites and hidden gems tailored just for you.
                </p>
            </div>
            </div>
        </div>
        </section>
        
        <section className="insights-section upcoming-releases">
          <h2>Upcoming Releases</h2>
          <div className="black-container">
            <div className="pink-container">
                <p style={{paddingTop: 0}}>Sneak Peek: Upcoming Releases</p>
            </div>
            </div>
          <div className="marquee-container">
            <div className="marquee-text">
                {[
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. ",
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. ",
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. ",
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. "
                ].map((text, index) => (
                <p key={index} className="marquee-item">{text}</p>
                ))}
                {[
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. ",
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. ",
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. ",
                "Get a sneak peek at the upcoming movies, series, animes, and books curated just for you. "
                ].map((text, index) => (
                <p key={`dup-${index}`} className="marquee-item">{text}</p>
                ))}
            </div>
            </div>
        </section>

       
        {/* What People Say Container */}
        <section className="insights-section what-people-say">
          <h2>
            <span style={{ fontSize: '13.25vw' }}>What</span> People Say{' '}
            <span style={{ fontSize: '9vw' }}>About</span> <span>UniSphere</span>
          </h2>
          <div className="black-container">
            <div className="pink-container">
                <p style={{paddingTop: 0}}>"Community Reviews & Testimonials</p>
            </div>
            </div>
          <div className="marquee-container">
            <div className="marquee-text">
              {[
                "Read testimonials and reviews from our community of entertainment enthusiasts.",
                "Read testimonials and reviews from our community of entertainment enthusiasts.",
                "Read testimonials and reviews from our community of entertainment enthusiasts.",
                "Read testimonials and reviews from our community of entertainment enthusiasts."
              ].map((text, index) => (
                <p key={index} className="marquee-item">{text}</p>
              ))}
              {[
                "Read testimonials and reviews from our community of entertainment enthusiasts.",
                "Read testimonials and reviews from our community of entertainment enthusiasts.",
                "Read testimonials and reviews from our community of entertainment enthusiasts.",
                "Read testimonials and reviews from our community of entertainment enthusiasts."
              ].map((text, index) => (
                <p key={`dup-${index}`} className="marquee-item">{text}</p>
              ))}
            </div>
          </div>
          {/* Testimonial Cards Container with relative positioning */}
          <div className="testimonial-cards" style={{ position: 'relative', minHeight: '600px' }}>
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className={testimonial.cardClass}
                data-tooltip-drag="drag"
                style={{
                    position: 'absolute',
                    left: positions[testimonial.id]?.x || 0,
                    top: positions[testimonial.id]?.y || 0,
                    cursor: 'move',
                    // zIndex: draggingId === testimonial.id ? 1000 : 1 // Increase z-index for the dragged card
                    zIndex: zIndexes[testimonial.id]
                }}
                  onMouseDown={(e) => handleMouseDown(e, testimonial.id)}
            >
                <div className="card-image">
                <img src={testimonial.image} alt={testimonial.alt} draggable="false"  />
                
                </div>
                <div className="card-text">
                  <p>
                    "{testimonial.text}
                    <br /><span>— {testimonial.author}</span>"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Insights;
