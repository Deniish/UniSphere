import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import '../Styles/LightBulb.css';

gsap.registerPlugin(Draggable);

//const MorphSVGPlugin = window.MorphSVGPlugin;

const ToggleSwitch = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Audio & state variables
    const AUDIO = {
      CLICK: new Audio('https://assets.codepen.io/605876/click.mp3')
    };
    let startX;
    let startY;
    let stateOn = false;
    const CORD_DURATION = 0.1;

    const container = containerRef.current;
    const CORDS = container.querySelectorAll('.toggle-scene__cord');
    const HIT = container.querySelector('.toggle-scene__hit-spot');
    const DUMMY = container.querySelector('.toggle-scene__dummy-cord');
    const DUMMY_CORD = container.querySelector('.toggle-scene__dummy-cord line');

    // Create a proxy element for Draggable
    const PROXY = document.createElement('div');
    const ENDX = DUMMY_CORD.getAttribute('x2');
    const ENDY = DUMMY_CORD.getAttribute('y2');

    const RESET = () => {
      gsap.set(PROXY, { x: ENDX, y: ENDY });
    };

    RESET();

    // GSAP timeline that creates the jiggle effect via morphSVG animations
    const CORD_TL = gsap.timeline({
      paused: true,
      onStart: () => {
        stateOn = !stateOn;
        document.documentElement.style.setProperty('--on', stateOn ? '1' : '0');
        gsap.set([DUMMY, HIT], { display: 'none' });
        gsap.set(CORDS[0], { display: 'block' });
        AUDIO.CLICK.play();
      },
      onComplete: () => {
        gsap.set([DUMMY, HIT], { display: 'block' });
        gsap.set(CORDS[0], { display: 'none' });
        RESET();
      }
    });

    // Add morphing tweens to the timeline to produce the animation (jiggle effect)
    for (let i = 1; i < CORDS.length; i++) {
      CORD_TL.add(
        gsap.to(CORDS[0], {
          morphSVG: CORDS[i],
          duration: CORD_DURATION,
          repeat: 1,
          yoyo: true
        })
      );
    }

    // Create a draggable instance to simulate the tug effect
    Draggable.create(PROXY, {
      trigger: HIT,
      type: 'x,y',
      onPress: e => {
        startX = e.x;
        startY = e.y;
      },
      onDrag: function () {
        gsap.set(DUMMY_CORD, {
          attr: {
            x2: this.x,
            y2: this.y
          }
        });
      },
      onRelease: function (e) {
        const DISTX = Math.abs(e.x - startX);
        const DISTY = Math.abs(e.y - startY);
        const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
        gsap.to(DUMMY_CORD, {
          attr: { x2: ENDX, y2: ENDY },
          duration: CORD_DURATION,
          onComplete: () => {
            // If the dragged distance is more than 50, restart the timeline to produce the jiggle effect
            if (TRAVELLED > 50) {
              CORD_TL.restart();
            } else {
              RESET();
            }
          }
        });
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="light-bulb-container">
      <svg className="toggle-scene" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" viewBox="0 0 197.451 481.081">
        <defs>
          <marker id="e" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </marker>
          <marker id="d" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </marker>
          <marker id="c" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </marker>
          <marker id="b" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </marker>
          <marker id="a" orient="auto" overflow="visible" refX="0" refY="0">
            <path className="toggle-scene__cord-end" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </marker>
          <clipPath id="g" clipPathUnits="userSpaceOnUse">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.677" d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z" />
          </clipPath>
          <clipPath id="f" clipPathUnits="userSpaceOnUse">
            <path d="M-868.418 945.051c-4.188 73.011 78.255 53.244 150.216 52.941 82.387-.346 98.921-19.444 98.921-47.058 0-27.615-4.788-42.55-73.823-42.55-69.036 0-171.436-30.937-175.314 36.667z" />
          </clipPath>
        </defs>
        <g className="toggle-scene__cords">
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.56v150.493" transform="translate(-24.503 256.106)" />
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.59s28 8.131 28 19.506-18.667 13.005-28 19.507c-9.333 6.502-28 8.131-28 19.506s28 19.507 28 19.507" transform="translate(-24.503 256.106)" />
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.575s-20 16.871-20 28.468c0 11.597 13.333 18.978 20 28.468 6.667 9.489 20 16.87 20 28.467 0 11.597-20 28.468-20 28.468" transform="translate(-24.503 256.106)" />
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.569s16 20.623 16 32.782c0 12.16-10.667 21.855-16 32.782-5.333 10.928-16 20.623-16 32.782 0 12.16 16 32.782 16 32.782" transform="translate(-24.503 256.106)" />
          <path className="toggle-scene__cord" markerEnd="url(#a)" fill="none" strokeLinecap="square" strokeWidth="6" d="M123.228-28.563s-10 24.647-10 37.623c0 12.977 6.667 25.082 10 37.623 3.333 12.541 10 24.647 10 37.623 0 12.977-10 37.623-10 37.623" transform="translate(-24.503 256.106)" />
          <g className="line toggle-scene__dummy-cord">
            <line markerEnd="url(#a)" x1="98.7255" x2="98.7255" y1="240.5405" y2="380.5405" />
          </g>
          <circle className="toggle-scene__hit-spot" cx="98.7255" cy="380.5405" r="60" fill="transparent" />
        </g>
      </svg>
    </div>
  );
};

export default ToggleSwitch;
