"use client";
import React, { useEffect, useRef, useState} from "react";
import MySvg from '../../ui/us-map.svg';

export default function Page() {

  const bubbleElement = useRef(null);
  const hoveredLocation = useRef(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {

    window.onmousemove = function (e) {
        var x = e.clientX,
            y = e.clientY;
        bubbleElement.current.style.top = (y + 20) + 'px';
        bubbleElement.current.style.left = (x) + 'px';
    };
  });

  function mapClick() {
    setLocation(`Searching for schools in ${hoveredLocation.current}...`);
  }

  function mouseMove(e) {

    if (e.target.tagName == 'path') {
        var content = e.target.dataset.name;

        hoveredLocation.current = content;

        bubbleElement.current.innerHTML = content;
        bubbleElement.current.style.opacity = "100%";
    }
    else {
        bubbleElement.current.style.opacity = "0%";
    }
}

  return (
    <div className="container p-6">
        <h1 className="text-2xl font-bold mb-4">Select the states you would like to explore</h1>

        <MySvg id="us-map" onMouseMove={mouseMove} onClick={mapClick} />
        <div id="details-box" ref={bubbleElement}></div>

        <h2>{location}</h2>

    </div>
  );
}