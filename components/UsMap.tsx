import React, { useRef } from "react";
import statePaths from "../data/state-paths.json"

export default function USMap({ activeStates, setActiveStates }) {
  const bubbleElement = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoveredLocation = useRef(null);
  const svgOffset = useRef([0, 0]);

  function mapClick(e) {
    if (e.target.tagName == 'path') {
      const stateID = e.target.dataset.id;
      const existingSelection = activeStates.findIndex(opt => opt === stateID);

      let items:string[];

      if (existingSelection > -1) {
        items = activeStates.filter((_, index) => index !== existingSelection);
      } else {
        items = [...activeStates, stateID];
      }

      if (items) {
        setActiveStates(items);
      }
    }
  }

  function mouseMove(e) {
    const x = e.clientX,
        y = e.clientY;

    if (!bubbleElement || !bubbleElement.current)
      return;

    bubbleElement.current.style.top = (y + 30 + svgOffset.current[1]) + 'px';
    bubbleElement.current.style.left = (x + svgOffset.current[0]) + 'px';

    if (e.target.tagName == 'path') {
      const content = e.target.dataset;
      hoveredLocation.current = content;

      bubbleElement.current.innerHTML = content.name;
      bubbleElement.current.style.opacity = "100%";
    }
    else {
      bubbleElement.current.style.opacity = "0%";
    }
  }

  return (
    <>
    <svg
      width="1000px"
      height="589px"
      ref={svgRef}
      onMouseMove={mouseMove}
      onClick={mapClick}
      viewBox="0 0 1000 589"
      style={{ strokeLinejoin: 'round', stroke: '#000', fill: 'none' }}
      id="us-map"
      preserveAspectRatio="xMinYMin meet"
    >
      <defs>
        <style>
          {`
          path {
            fill-rule: evenodd;
            stroke: white;
            fill: #88161856;
            transition: fill .4s ease;
            transform-origin: center center;
          }

          path.active {
            fill: #881618c3;
          }

          path:hover {
            fill: #881618;
            cursor: pointer;
            transform: scale(1.002, 1.002);
          }
        `}
        </style>
      </defs>
      {
        statePaths.map(({ id, name, d }) => (
          <path
            className={`${activeStates.some(selectedId => selectedId === id) ? "active" : ""}`}
            key={id}
            id={id}
            data-name={name}
            data-id={id}
            d={d}
          />

        ))
      }
    </svg>
    <div id="details-box" ref={bubbleElement}></div>
    </>
  );
}
