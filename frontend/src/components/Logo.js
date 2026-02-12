import React from 'react';

const Logo = ({ className = "h-8 w-8" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background shape */}
            <circle cx="50" cy="50" r="45" className="fill-blue-600" />

            {/* Building/City silhouette */}
            <path
                d="M30 75V45L50 30L70 45V75H30Z"
                className="fill-white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect x="42" y="55" width="16" height="20" className="fill-blue-600" />

            {/* Leaf/Nature element symbolizing 'Clean' */}
            <path
                d="M65 25C65 25 75 15 85 25C95 35 85 45 65 55"
                className="stroke-green-400"
                strokeWidth="5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default Logo;
