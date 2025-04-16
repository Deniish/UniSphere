import React, { useEffect, useState } from "react";
import "../Styles/CustomCursor.css";

const CustomCursor = () => {
  // Start with an off-screen position
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Set the x coordinate as the cursor x position,
      // and add a small offset (e.g., 5px) to the y coordinate so the ball appears slightly below the cursor.
      setPosition({ x: event.clientX, y: event.clientY + 4 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

export default CustomCursor;
