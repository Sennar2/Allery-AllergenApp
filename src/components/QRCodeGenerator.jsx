// src/components/QRCodeGenerator.jsx
import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = () => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef();
  const currentUrl = window.location.href;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        📱 Show QR Code
      </button>

      {open && (
        <div
          ref={popupRef}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg border w-64 z-50"
        >
          <h2 className="text-center font-semibold mb-2">Scan to Open</h2>
          <div className="flex justify-center">
            <QRCodeSVG value={currentUrl} size={160} />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mt-4 block mx-auto px-3 py-1 text-sm text-gray-600 hover:text-black"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
