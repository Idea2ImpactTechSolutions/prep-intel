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
  const svgElement = useRef(null);
  const hoveredLocation = useRef(null);
  const [schools, setSchools] = useState([]);
  const [activeOption, setActiveOption] = useState();
  const svgOffset = useRef([0,0]);

  const fetchSchoolData = async (stateID: String) => {
    //setIsLoading(true);
    try {
      const response = await fetch(
        `/api/manager/profile/hd2021?stateID=${stateID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSchools(data);
      //setIsLoading(false);
    } catch (error) {
      console.error("There was a problem fetching school data:", error);
    }
  };

  useEffect(() => {

    var rect = document.querySelectorAll('object')[0].getBoundingClientRect();
    svgOffset.current = [rect.left, rect.top];

    // Select the child svg and assign events and store a reference in svgElement
    const svg = document.querySelectorAll('object')[0].contentDocument;
    svg.onclick = mapClick;
    svg.onmousemove = mouseMove;
    svgElement.current = svg;
  });

  // useEffect hook
  useEffect(() => {
    if (activeOption)
    {
      svgElement.current.querySelector('.active')?.classList.remove('active');
      svgElement.current.getElementById(activeOption.value).classList.add('active');
      //let x = svgElement.current.childNodes.find(e => e.dataset.id == activeOption.Value);
      fetchSchoolData(activeOption.value);
    }
  }, [activeOption]);

  function mapClick(e) {
    if (e.target.tagName == 'path') {
      const stateID = e.target.dataset.id;
      const listOption = options.find(opt => opt.value === stateID);
      setActiveOption(listOption);
    }
  }

  function mouseMove(e) {

    var x = e.clientX,
    y = e.clientY;

    //console.log(x, y);
    bubbleElement.current.style.top = (y + 20 +svgOffset.current[1] ) + 'px';
    bubbleElement.current.style.left = (x+svgOffset.current[0]) + 'px';

    if (e.target.tagName == 'path') {
        var content = e.target.dataset;
        hoveredLocation.current = content;

        bubbleElement.current.innerHTML = content.name;
        bubbleElement.current.style.opacity = "100%";
    }
    else {
        bubbleElement.current.style.opacity = "0%";
    }
  }

  return (
    <div className="container p-0 mt-6">
        <h1 className="text-2xl font-bold mb-4">Select the states you would like to explore</h1>

        <object ref={svgElement} type="image/svg+xml" data="/images/us-map.svg">Your browser does not support SVG</object>

        <div id="details-box" ref={bubbleElement}></div>

        <h2>Select State</h2>
        <Select instanceId="state-select"
            options={options}
            value={activeOption}
            onChange={setActiveOption}
            className="w-[400px]" />

        <h2 className="mt-4">Schools</h2>
        <ul className="grid grid-cols-3">
            {
                schools.map((school, index) => (
                <li className="m-2" key={index} >
                    {school.INSTNM}
                </li>
                ))
            }
        </ul>

    </div>
  );
}