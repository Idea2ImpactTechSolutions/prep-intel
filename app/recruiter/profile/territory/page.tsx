"use client";
import React, { useRef, useEffect } from "react";
import BottomBar from "../shared/bottom-bar";
import { useRouter } from "next/navigation";

export default function Page() {
  const bubbleElement = useRef<HTMLDivElement>(null);
  const hoveredLocation = useRef(null);
  const router = useRouter();
  const svgElement = useRef(null);

  useEffect(() => {

    window.onmousemove = function (e) {
        var x = e.clientX,
            y = e.clientY;
        if (bubbleElement.current) {
          bubbleElement.current.style.top = (y + 20) + 'px';
          bubbleElement.current.style.left = (x) + 'px';
        }
    };

    return () => {
      window.onmousemove = null;
    }
  }, []);

  function mouseMove(e) {

    if (!bubbleElement?.current)
      return;

    if (e.target.tagName == 'path') {
        var content = e.target.dataset.name;

        hoveredLocation.current = content;

        bubbleElement.current.innerHTML = content;
        bubbleElement.current.style.opacity = "100%";
    } else {
        bubbleElement.current.style.opacity = "0%";
    }
  }

  // Placeholder
  let isSubmitting = false;
  const initialValues = {
    firstName: '',
    lastName: ''
  };

  return (
    <div className="container p-0 mt-6">
        <h1 className="text-2xl font-bold mb-4">Where Do You Recruit?</h1>
        <div className="ml-20 mb-20">
          <object ref={svgElement} type="image/svg+xml" data="/images/us-map.svg">Your browser does not support SVG</object>
          <div id="details-box" ref={bubbleElement}></div>
        </div>
        <BottomBar
            isBackDisabled={true}
            isSubmitting={isSubmitting}
            onBack={() => {}}
            onNext={() => router.push("/recruiter/dashboard")}
          />
    </div>
  );
}