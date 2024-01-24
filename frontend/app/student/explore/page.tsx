"use client";
import React, { useEffect, useRef, useState} from "react";
import MySvg from '../../ui/us-map.svg';
import Select from 'react-select'

const options = [
    {"value": "AL", "label": "Alabama"},
    {"value": "AK", "label": "Alaska"},
    {"value": "AZ", "label": "Arizona"},
    {"value": "AR", "label": "Arkansas"},
    {"value": "CA", "label": "California"},
    {"value": "CO", "label": "Colorado"},
    {"value": "CT", "label": "Connecticut"},
    {"value": "DE", "label": "Delaware"},
    {"value": "DC", "label": "District of Columbia"},
    {"value": "FL", "label": "Florida"},
    {"value": "GA", "label": "Georgia"},
    {"value": "HI", "label": "Hawaii"},
    {"value": "ID", "label": "Idaho"},
    {"value": "IL", "label": "Illinois"},
    {"value": "IN", "label": "Indiana"},
    {"value": "IA", "label": "Iowa"},
    {"value": "KS", "label": "Kansas"},
    {"value": "KY", "label": "Kentucky"},
    {"value": "LA", "label": "Louisiana"},
    {"value": "ME", "label": "Maine"},
    {"value": "MD", "label": "Maryland"},
    {"value": "MA", "label": "Massachusetts"},
    {"value": "MI", "label": "Michigan"},
    {"value": "MN", "label": "Minnesota"},
    {"value": "MS", "label": "Mississippi"},
    {"value": "MO", "label": "Missouri"},
    {"value": "MT", "label": "Montana"},
    {"value": "NE", "label": "Nebraska"},
    {"value": "NV", "label": "Nevada"},
    {"value": "NH", "label": "New Hampshire"},
    {"value": "NJ", "label": "New Jersey"},
    {"value": "NM", "label": "New Mexico"},
    {"value": "NY", "label": "New York"},
    {"value": "NC", "label": "North Carolina"},
    {"value": "ND", "label": "North Dakota"},
    {"value": "OH", "label": "Ohio"},
    {"value": "OK", "label": "Oklahoma"},
    {"value": "OR", "label": "Oregon"},
    {"value": "PA", "label": "Pennsylvania"},
    {"value": "RI", "label": "Rhode Island"},
    {"value": "SC", "label": "South Carolina"},
    {"value": "SD", "label": "South Dakota"},
    {"value": "TN", "label": "Tennessee"},
    {"value": "TX", "label": "Texas"},
    {"value": "UT", "label": "Utah"},
    {"value": "VT", "label": "Vermont"},
    {"value": "VA", "label": "Virginia"},
    {"value": "WA", "label": "Washington"},
    {"value": "WV", "label": "West Virginia"},
    {"value": "WI", "label": "Wisconsin"},
    {"value": "WY", "label": "Wyoming"},
];

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

        <MySvg id="us-map" onMouseMove={mouseMove} onClick={mapClick} height="350" />
        <div id="details-box" ref={bubbleElement}></div>

        <h2>{location}</h2>

        <Select options={options} className="w-[400px]" />

    </div>
  );
}