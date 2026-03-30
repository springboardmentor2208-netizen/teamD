import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const PhotoCarousel = ({ photos }) => {
  if (!photos || !Array.isArray(photos) || photos.length === 0) return null;

  return (
    /* CHANGED: Height increased to h-[300px] (mobile) and md:h-[400px] (desktop) 
       Also updated rounded corners to match the 2.5rem theme of the app */
    <div className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-950 group">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="h-full w-full cleanstreet-swiper"
      >
        {photos.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={url}
                alt={`Evidence ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle Dark Overlay for better text/bullet contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* INTERNAL CSS UPDATED FOR PREMIUM THEME */}
      <style>{`
        .cleanstreet-swiper .swiper-pagination {
          bottom: 25px !important;
          z-index: 50 !important;
        }

        .cleanstreet-swiper .swiper-pagination-bullet {
          background: #ffffff !important;
          opacity: 0.5 !important;
          width: 8px !important;
          height: 8px !important;
          margin: 0 6px !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3) !important;
          transition: all 0.3s ease !important;
        }

        .cleanstreet-swiper .swiper-pagination-bullet-active {
          background: #2563eb !important; /* CleanStreet Blue */
          opacity: 1 !important;
          width: 24px !important; /* Elongated active pill look */
          border-radius: 10px !important;
        }
      `}</style>
    </div>
  );
};

export default PhotoCarousel;