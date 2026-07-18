import { useState, useEffect } from "react";

// Space-related images for astronaut mental health theme
const images = [
  "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Earth from space
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Space station
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Astronaut in space
  "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Deep space
  "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Space exploration
];

interface SlideshowBackgroundProps {
  className?: string;
}

export const SlideshowBackground = ({ className = "" }: SlideshowBackgroundProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeClass, setFadeClass] = useState("opacity-0");

  useEffect(() => {
    // Preload first image
    const firstImage = new Image();
    firstImage.onload = () => {
      setIsLoaded(true);
      setFadeClass("opacity-100");
    };
    firstImage.src = images[0];

    const interval = setInterval(() => {
      setFadeClass("opacity-0");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFadeClass("opacity-100");
    }, 8000); // Change image every 8 seconds with seamless transitions

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden animate-fade-in ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
            index === currentIndex ? `${fadeClass} scale-100` : "opacity-0 scale-105"
          }`}
        >
          <img
            src={image}
            alt={`Space mission mental health support slideshow ${index + 1}`}
            className="w-full h-full object-cover object-center transition-transform duration-[3000ms] ease-out brightness-70 contrast-100 dark:brightness-50 dark:contrast-110"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      
      {/* Multi-layer overlay for optimal text readability */}
      <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/15 dark:from-primary/40 dark:via-primary/20 dark:to-accent/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
      <div className="absolute inset-0 bg-gradient-hero/30 dark:bg-gradient-hero/50" />
      
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-hero animate-pulse" />
      )}
    </div>
  );
};