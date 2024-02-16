"use client";
import React, { useEffect, useRef, useState } from "react";
import Select from 'react-select'
import { useRouter } from "next/navigation";

const options = [
  { "value": "AL", "label": "Alabama" },
  { "value": "AK", "label": "Alaska" },
  { "value": "AZ", "label": "Arizona" },
  { "value": "AR", "label": "Arkansas" },
  { "value": "CA", "label": "California" },
  { "value": "CO", "label": "Colorado" },
  { "value": "CT", "label": "Connecticut" },
  { "value": "DE", "label": "Delaware" },
  { "value": "DC", "label": "District of Columbia" },
  { "value": "FL", "label": "Florida" },
  { "value": "GA", "label": "Georgia" },
  { "value": "HI", "label": "Hawaii" },
  { "value": "ID", "label": "Idaho" },
  { "value": "IL", "label": "Illinois" },
  { "value": "IN", "label": "Indiana" },
  { "value": "IA", "label": "Iowa" },
  { "value": "KS", "label": "Kansas" },
  { "value": "KY", "label": "Kentucky" },
  { "value": "LA", "label": "Louisiana" },
  { "value": "ME", "label": "Maine" },
  { "value": "MD", "label": "Maryland" },
  { "value": "MA", "label": "Massachusetts" },
  { "value": "MI", "label": "Michigan" },
  { "value": "MN", "label": "Minnesota" },
  { "value": "MS", "label": "Mississippi" },
  { "value": "MO", "label": "Missouri" },
  { "value": "MT", "label": "Montana" },
  { "value": "NE", "label": "Nebraska" },
  { "value": "NV", "label": "Nevada" },
  { "value": "NH", "label": "New Hampshire" },
  { "value": "NJ", "label": "New Jersey" },
  { "value": "NM", "label": "New Mexico" },
  { "value": "NY", "label": "New York" },
  { "value": "NC", "label": "North Carolina" },
  { "value": "ND", "label": "North Dakota" },
  { "value": "OH", "label": "Ohio" },
  { "value": "OK", "label": "Oklahoma" },
  { "value": "OR", "label": "Oregon" },
  { "value": "PA", "label": "Pennsylvania" },
  { "value": "RI", "label": "Rhode Island" },
  { "value": "SC", "label": "South Carolina" },
  { "value": "SD", "label": "South Dakota" },
  { "value": "TN", "label": "Tennessee" },
  { "value": "TX", "label": "Texas" },
  { "value": "UT", "label": "Utah" },
  { "value": "VT", "label": "Vermont" },
  { "value": "VA", "label": "Virginia" },
  { "value": "WA", "label": "Washington" },
  { "value": "WV", "label": "West Virginia" },
  { "value": "WI", "label": "Wisconsin" },
  { "value": "WY", "label": "Wyoming" },
];

export default function Page() {
  const router = useRouter();
  const bubbleElement = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLObjectElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoveredLocation = useRef(null);
  const [activeSelection, setActiveSelection] = useState<any[]>([]);
  const svgOffset = useRef([0, 0]);

  useEffect(() => {
    if (objectRef.current) {
      var rect = objectRef.current.getBoundingClientRect();
      svgOffset.current = [rect.left, rect.top];

        const setObjectSVGRef = () => {
          if (objectRef.current) {
              const svgDocument = objectRef.current.contentDocument;
              if (svgDocument) {
                // @ts-ignore
                const svgElement = svgDocument.documentElement as SVGSVGElement;
                svgElement.onclick = mapClick;
                svgElement.onmousemove = mouseMove;

                svgRef.current = svgElement;
                console.log('SVG Element:', svgRef.current);
              }
          }
      };

      if (objectRef.current) {
          // Check if SVG is already loaded
          if (objectRef.current.contentDocument) {
              setObjectSVGRef();
          } else {
              // Attach load event listener
              objectRef.current.addEventListener('load', setObjectSVGRef);
          }
      }

      return () => {
          // Cleanup: Remove event listeners
          if (objectRef.current) {
              objectRef.current.removeEventListener('load', setObjectSVGRef);
              objectRef.current.onclick = null;
              objectRef.current.onmousemove = null;
          }
      };
    }
  }, []);

  // useEffect hook
  useEffect(() => {
    if (activeSelection && svgRef?.current) {
      // Clear active states
      svgRef.current.querySelector('.active')?.classList.remove('active');

      // Set current selection to .active
      activeSelection.forEach(option => {
        svgRef.current?.getElementById(option.value).classList.add('active');
      })
    }
  }, [activeSelection]);

  function mapClick(e) {
    if (e.target.tagName == 'path') {
      const stateID = e.target.dataset.id;
      const existingSelection = activeSelection.findIndex(opt => opt.value === stateID);
      debugger;
      if (existingSelection > -1) {
        activeSelection.splice(existingSelection, 1);

        let items = [...activeSelection];
        setActiveSelection(items);
      } else {
        const listOption = options.find(opt => opt.value === stateID);
        let items = [...activeSelection, listOption];
        setActiveSelection(items);
      }
    }
  }

  function mouseMove(e) {

    var x = e.clientX,
      y = e.clientY;

    if (!bubbleElement || !bubbleElement.current)
      return;

    //console.log(x, y);
    bubbleElement.current.style.top = (y + 20 + svgOffset.current[1]) + 'px';
    bubbleElement.current.style.left = (x + svgOffset.current[0]) + 'px';

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
      [{activeSelection.length}]
      <object ref={objectRef} type="image/svg+xml" data="/images/us-map.svg">Your browser does not support SVG</object>
      <div id="details-box" ref={bubbleElement}></div>

      <h2>Select State</h2>
      <div className="flex">

      <Select instanceId="state-select"
        options={options}
        isMulti
        value={activeSelection}
        className="w-[400px]" />
      <div className="flex-grow"></div>

      <button
        type="submit"
        className="flex items-center bg-primary hover:bg-primary-500 text-white font-bold py-4 px-4 rounded mr-1 pr-2"
        onClick={() => router.push(`/student/explore-schools?states=${activeSelection.map(s => s.value).join(',') }`)}

      ><div className="leading-none inline-block -mt-1">Next</div></button>
      </div>
    </div>
  );
}