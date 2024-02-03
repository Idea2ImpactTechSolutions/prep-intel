"use client";
import React, { useRef, useEffect } from "react";
import { Formik } from "formik";
import BottomBar from "../shared/bottom-bar";
import { useRouter } from "next/navigation";
import MySvg from '../../../ui/us-map.svg';

const handleSubmit = async (values, { setSubmitting }) => {
  // Placeholder
  console.log("submitting form");
}

export default function Page() {
  const bubbleElement = useRef(null);
  const hoveredLocation = useRef(null);
  const router = useRouter();


  useEffect(() => {

    window.onmousemove = function (e) {
        var x = e.clientX,
            y = e.clientY;
        if (bubbleElement.current) {
          bubbleElement.current.style.top = (y + 20) + 'px';
          bubbleElement.current.style.left = (x) + 'px';
        }
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

  // Placeholder
  let isSubmitting = false;

  return (
    <Formik
      onSubmit={handleSubmit}
    >
    <div className="container p-0 mt-6">
        <h1 className="text-2xl font-bold mb-4">Where Do You Recruit?</h1>
        <div className="ml-20 mb-20">
          <MySvg id="us-map" onMouseMove={mouseMove} onClick={mapClick} height="450"  />
          <div id="details-box" ref={bubbleElement}></div>
        </div>
        <BottomBar
            isBackDisabled={true}
            isSubmitting={isSubmitting}
            onNext={() => router.push("/recruiter/dashboard")}
          />
    </div>
    </Formik>
  );
}