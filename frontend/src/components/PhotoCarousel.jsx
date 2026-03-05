import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const PhotoCarousel = ({ photos }) => {
  if (!photos || !Array.isArray(photos) || photos.length === 0) return null;

  return (
    <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black group">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="h-full w-full mySwiper"
      >
        {photos.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url}
              alt="Evidence"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* INTERNAL CSS TO FORCE VISIBILITY */}
      <style>{`
        /* 1. Ensure the container exists and is visible */
        .mySwiper .swiper-pagination {
          bottom: 15px !important;
          z-index: 50 !important;
          display: block !important;
          visibility: visible !important;
        }

        /* 2. Style the dots with a shadow so they show on white images */
        .mySwiper .swiper-pagination-bullet {
          background: #ffffff !important;
          opacity: 0.7 !important;
          width: 10px !important;
          height: 10px !important;
          margin: 0 5px !important;
          box-shadow: 0 0 5px rgba(0,0,0,0.8) !important;
          display: inline-block !important;
        }

        /* 3. Style the active dot */
        .mySwiper .swiper-pagination-bullet-active {
          background: #3b82f6 !important; /* Bright Blue */
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </div>
  );
};

export default PhotoCarousel;