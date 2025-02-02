"use client";

import { useEffect } from "react";

export default function DisableRightClick() {
  useEffect(() => {
    const handleRightClick = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleRightClick);
    return function () {
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);
  return <></>;
}
