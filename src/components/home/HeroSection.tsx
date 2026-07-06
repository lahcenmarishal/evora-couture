import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import heroVideo from '@/assets/hero-video.mp4';
import heroImage from '@/assets/caftan-riad.jpg';

export function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
      {/* Background video with fallback to image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        {/* Fallback image - shown while video loads or on error */}
        <img
          src={heroImage}
          alt="EVORA COUTURE - Caftans Marocains"
          className={`absolute inset-0 w-full h-full object-cover object-[center_20%] transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video background */}
        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover object-[center_20%] transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
        
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-hero-overlay/70 via-hero-overlay/30 to-hero-overlay/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-hero-overlay/40 to-transparent" />
      </motion.div>

      {/* Content - Centered minimal approach */}
      <div className="container-fashion relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="max-w-3xl mx-auto"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-caption text-white/70 mb-6 block"
          >
            Collection 2025
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-display text-white mb-8"
          >
            Modern Moroccan
            <br />
            <span className="italic">Caftans</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="text-body text-white/80 mb-12 max-w-lg mx-auto"
          >
            L'art ancestral de l'caftan marocaine sublimé par une vision contemporaine.
            Élégance intemporelle, savoir-faire artisanal.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Link
              to="/collection"
              className="inline-flex items-center gap-4 px-12 py-5 bg-white text-foreground text-caption 
                         hover:bg-white/95 transition-all duration-500 group"
            >
              Découvrir la Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-20 bg-gradient-to-b from-transparent via-white/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
