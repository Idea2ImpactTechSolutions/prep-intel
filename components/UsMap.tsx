import React, { useRef, Dispatch, SetStateAction } from "react";
import { statePaths, stateLabels } from "../data/state-paths.js"

interface PageProps {
  setActiveStates: Dispatch<SetStateAction<string[]>>;
  activeStates: string[];
  useStateCode?: boolean;
}

export default function USMap({ activeStates, setActiveStates, useStateCode=true }:PageProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  let offsetX, offsetY;
  let isDragging = false;

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
    if (isDragging) {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      e.target.setAttribute('x', newX);
      e.target.setAttribute('y', newY);
    }
  }

  function elemMouseDown(e) {
        isDragging = true;
        //const { x, y } = e.target.getBoundingClientRect();

        offsetX = e.clientX - e.target.getAttribute("x");
        offsetY = e.clientY - e.target.getAttribute("y");
  }

  function elemMouseUp(e) {
    isDragging = false;
  }

  function getStateName(code) {
    return statePaths.find((p) => p.id == code)?.name || '';
  }

  return (
    <>
    <svg
      ref={svgRef}
      onMouseMove={mouseMove}
      onMouseUp={elemMouseUp}
      onClick={mapClick}
      viewBox="80 0 1000 589"
      id="us-map"
      style={{width: "100%", height: "auto"}}
      preserveAspectRatio="xMinYMin meet"
    >
      <defs>
        <style>
          {`
          #us-map path {
            fill-rule: evenodd;
            stroke: white;
            fill: #E3E9F1;
            transition: fill .4s ease;
            transform-origin: center center;
          }

          #us-map path.active {
            fill: #FEBB0E;
          }

          #us-map path:hover {
            fill: #f9db90;
            cursor: pointer;
            transform: scale(1.002, 1.002);
          }

          #us-map text {
            font: 10px sans-serif;
            pointer-events: none;
            font-weight: bold;
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
      {
        stateLabels.map((item, index) => (
          <text onMouseDown={elemMouseDown}
            fontWeight="lighter"
            key={index}
            x={item.x}
            y={item.y}
          >{useStateCode ? item.key : getStateName(item.key)}</text>
        ))
      }

    </svg>
    </>
  );
}

