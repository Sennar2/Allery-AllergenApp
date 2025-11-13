import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="sticky bottom-0 w-full bg-gradient-to-r from-gray-50 to-green-50 border-t-2 border-gray-200 py-4 shadow-lg z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start gap-3 mb-3">
          <IoAlertCircleOutline className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> Data is provided by the venue, which is solely responsible for allergen information. 
            <span className="font-semibold"> Always verify with your server before ordering.</span>
          </p>
        </div>
        <div className="text-center border-t border-gray-300 pt-3">
          <p className="text-xs text-gray-600">
            © 2025 <span className="font-semibold">Allerly UK</span> | 
            <span className="text-green-700 font-medium"> #EatSafely</span> | 
            <a 
              href="https://twitter.com/getallerly" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 hover:underline ml-1"
            >
              @getallerly
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;