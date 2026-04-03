import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M110 110 C 100 110, 90 100, 100 80 C 110 60, 130 60, 140 70 C 150 40, 210 30, 230 60 C 250 50, 280 60, 270 90 C 265 105, 250 110, 250 110" stroke="#4DB8FF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="200" y="130" fontFamily="Brush Script MT, cursive" fontSize="64" fill="#002D62" textAnchor="middle" fontWeight="bold">white cloud</text>
    <text x="200" y="170" fontFamily="Arial, sans-serif" fontSize="24" fill="#002D62" textAnchor="middle" letterSpacing="6" fontWeight="bold">HOMESTAY</text>
  </svg>
);
