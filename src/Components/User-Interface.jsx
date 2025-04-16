import React, { useEffect, useRef, useState } from "react";
import "../Styles/BlackHoleEffect.css";
import Navbar from "./Navbar";

const UserInterface = () => {
  const images = [
    "/Photos/img0.jpg",
    "/Photos/img1.jpg",
    "/Photos/img2.jpg",
    "/Photos/img3.jpg",
    "/Photos/img4.jpg",
    "/Photos/img5.jpg",
    "/Photos/img6.jpg",
    "/Photos/img7.jpg",
    "/Photos/img8.jpg",
    "/Photos/img9.jpg",
    "/Photos/img10.jpg",
    "/Photos/img11.jpg",
    "/Photos/img12.jpg",
    "/Photos/img13.jpg",
    "/Photos/img14.jpg",
    "/Photos/img15.jpg",
    "/Photos/img16.jpeg",
    "/Photos/img17.jpeg",
    "/Photos/img18.jpeg",
    "/Photos/img19.jpeg",
    "/Photos/img20.jpeg",
    "/Photos/img21.jpeg",
    "/Photos/img22.jpeg",
    "/Photos/img23.jpeg",
    "/Photos/img24.jpeg",
    "/Photos/img25.jpeg",
    "/Photos/img26.jpeg",
    "/Photos/img27.jpeg",
    "/Photos/img28.jpeg",
    "/Photos/img29.jpeg",
    "/Photos/img30.jpeg",
    "/Photos/img31.jpeg",
    "/Photos/img32.jpeg",
    "/Photos/img33.jpeg",
    "/Photos/img34.jpeg",
    "/Photos/img35.jpeg",
    "/Photos/img36.jpeg",
    "/Photos/img37.jpeg",
    "/Photos/img38.jpeg",
    "/Photos/img39.jpeg",
    "/Photos/img40.jpeg",
    "/Photos/img41.jpeg",
    "/Photos/img42.jpeg",
    "/Photos/img43.jpeg",
    "/Photos/img44.jpeg",
    "/Photos/img45.jpeg",
    "/Photos/img46.jpeg",
    "/Photos/img47.jpeg",
    "/Photos/img48.jpeg",
    "/Photos/img49.jpeg",
    "/Photos/img50.jpeg",
    "/Photos/img51.jpeg",
    "/Photos/img52.jpeg",
    "/Photos/img53.jpeg",
    "/Photos/img54.jpeg",
    "/Photos/img55.jpeg",
    "/Photos/img56.jpeg",
    "/Photos/img57.jpeg",
    "/Photos/img58.jpeg",
    "/Photos/img59.jpeg",
    "/Photos/img60.jpeg",
    "/Photos/img61.jpeg",
  ];

  // State for image preloading and theme toggle
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const imageRefs = useRef(new Map());
  let currentIndex = 0;

  // Preload all images before rendering
  const preloadAllImages = (imageArray) => {
    return Promise.all(
      imageArray.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            imageRefs.current.set(src, true);
            resolve();
          };
          img.onerror = reject;
        });
      })
    );
  };

  useEffect(() => {
    // Hide the scrollbar on mount
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    preloadAllImages(images)
      .then(() => {
        setIsImagesLoaded(true);
        spawnParticles(); // Start animations
      })
      .catch((err) => console.error("Image preloading failed", err));

    // Restore the original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const random = (min, max) => Math.random() * (max - min) + min;

  const createParticle = (imageSrc) => {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Create img element inside the particle div
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.loading = "eager";
    particle.appendChild(img);

    const particleSize = random(50, 100);
    const orbitRadius = random(300, 700);
    const duration = random(12, 17);
    const revolutions = random(1, 2);
    const randomRotation = random(-45, 45);

    Object.assign(particle.style, {
      width: `${particleSize}px`,
      height: `${particleSize * 2}px`,
      position: "absolute",
      borderRadius: "10%",
      zIndex: "1", // Fixed z-index to ensure particles stay behind UI elements
      top: "50%",
      left: "50%",
      transformOrigin: "center",
      overflow: "hidden",
      transform: `rotate(${randomRotation}deg)`,
    });

    particle.style.setProperty("--orbit-radius", `${orbitRadius}px`);
    particle.style.setProperty("--revolutions", revolutions);
    particle.style.animation = `spiral-into-hole ${duration}s linear forwards`;

    // Maintain visual effect on hover
    particle.addEventListener("mouseenter", () => {
      particle.style.transform = `rotate(${randomRotation + 10}deg) scale(1.1)`;
    });
    particle.addEventListener("mouseleave", () => {
      particle.style.transform = `rotate(${randomRotation}deg) scale(1)`;
    });

    // Append to the dedicated particle container
    const particleContainer = document.getElementById("particle-container");
    particleContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  };

  const spawnParticles = () => {
    const imageSrc = images[currentIndex];
    currentIndex = (currentIndex + 1) % images.length;

    if (imageRefs.current.has(imageSrc)) {
      createParticle(imageSrc);
    }

    setTimeout(spawnParticles, random(1000, 1500));
  };

  return (
    <div className={`black-hole-body-main ${darkMode ? "dark-mode" : "light-mode-home"}`}>
      <div className="black-hole-body">
        {/* Particle container with low z-index */}
        <div id="particle-container"></div>
        {!isImagesLoaded ? (
          <div className="loading-container">
            UniSphere
            <img
              src="/Icons/Loader.svg"
              alt="Loading..."
              style={{
                position: "absolute",
                top: "50px",
                width: "60px",
                height: "60px",
              }}
            />
          </div>
        ) : (
          <div className="black-hole-container">
            <Navbar darkMode={darkMode} />

            <svg width="0" height="0">
              <filter id="noiseFilter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.8 1.2"
                  numOctaves="4"
                  seed="10"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncA type="table" tableValues="0 0.04" />
                </feComponentTransfer>
                <feBlend mode="overlay" in="SourceGraphic" />
                <animate
                  attributeName="baseFrequency"
                  values="0.8 1.2; 1.0 1.4; 0.8 1.2"
                  dur="0.001s"
                  repeatCount="indefinite"
                />
              </filter>
            </svg>
            <div id="background-gradient"></div>
            <div id="noise-overlay"></div>
            <div className="text-intro">UniSphere</div>
            <div className="text-sub wrapper">
              Smarter Way &nbsp;to
              <div className="words">
                <span className="sp">Watch It.</span>
                <span className="sp">Feel It.</span>
                <span className="sp">Love It.</span>
                <span className="sp">Share It.</span>
                <span className="sp">Watch It.</span>
              </div>
            </div>
            <div style={{ display: "none" }}>
              {images.map((src) => (
                <img key={src} data-src={src} alt="" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Only render the dark/light toggle when images are loaded */}
      {isImagesLoaded && (
        <div className="toggle-container-home">
          <input
            type="checkbox"
            id="theme-toggle"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="toggle-input"
          />
          <label htmlFor="theme-toggle" className="toggle-switch-home">
            <div className="toggle-content">
              <span className="toggle-icon-home light">Light</span>
              <span className="toggle-icon-home dark">Dark</span>
            </div>
            <span className="toggle-slider" />
          </label>
        </div>
      )}
    </div>
  );
};

export default UserInterface;
