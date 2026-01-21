'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useTransform, motion } from 'framer-motion';

// --- KONFIGURASI STYLE ---

const LOGO_STYLE = {
  textShadow: '4px 4px 0px #003366',
  WebkitTextStroke: '3px white',
};

const PRODUCT_TITLE_STYLE = {
  textShadow: '0px 10px 20px rgba(0,0,0,0.5)',
  WebkitTextStroke: '1px rgba(255,255,255,0.2)',
};

export default function HeroScroller() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // --- KONTEN MARQUEE (TEKS BERJALAN) ---
  // SAYA PINDAHKAN KE SINI AGAR PASTI TER-UPDATE
  // Menggunakan simbol '✦' (Sparkle)
  const MARQUEE_TEXT = "OPEN DAILY 10.00 - 22.00   ✦   FREE WIFI   ✦   BEST FRAPPUCCINO IN TOWN   ✦   SORE SPACE   ✦   ";
  const MARQUEE_CONTENT = Array(10).fill(MARQUEE_TEXT);

  // 1. SETUP SCROLL
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 2. PRELOAD GAMBAR
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      const frameCount = 240;

      for (let i = 1; i <= frameCount; i++) {
        const fileName = `ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
        const src = `/sequence/${fileName}`;

        const img = new Image();
        img.src = src;

        await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });

        loadedImages.push(img);
        setLoadProgress(Math.floor((i / frameCount) * 100));
      }

      setImages(loadedImages);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  // 3. RENDER CANVAS
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = images[index];

    if (!canvas || !ctx || !img || img.naturalWidth === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  };

  // 4. ANIMASI SCROLL
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (images.length === 0 || isLoading) return;
    const frameIndex = Math.min(images.length - 1, Math.floor(latest * (images.length - 1)));
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        if (!isLoading && images.length > 0) renderFrame(0);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images, isLoading]);


  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#2b1d12]">

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Layer 0: Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />

        {/* ======================================================== */}
        {/* Layer 1: BRANDING AWAL (SORE SPACE) */}
        {/* ======================================================== */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
          className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
        >
          <h1
            style={LOGO_STYLE}
            className="text-[10rem] md:text-[15rem] font-black text-[#FF914D] tracking-tighter leading-none"
          >
            SORE
          </h1>
          <div className="relative -mt-4 md:-mt-8">
            <div className="bg-[#003366] text-[#FF914D] px-6 py-2 md:px-10 md:py-4 rounded-xl border-4 border-white transform -rotate-2 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
              <h2 className="text-3xl md:text-5xl font-black tracking-widest uppercase">
                SPACE
              </h2>
            </div>
          </div>
        </motion.div>


        {/* ======================================================== */}
        {/* Layer 2: NAMA PRODUK (FRAPPUCCINO) */}
        {/* ======================================================== */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.8, 1], [0, 1, 1, 0]),
            scale: useTransform(scrollYProgress, [0.2, 0.4], [0.8, 1]),
            y: useTransform(scrollYProgress, [0.2, 0.4], [100, 0])
          }}
          className="absolute z-10 flex flex-col items-center pointer-events-none w-full px-4"
        >
          <span className="text-white font-mono tracking-[0.5em] text-sm md:text-lg mb-2 bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
            SIGNATURE MENU
          </span>
          <h2
            style={PRODUCT_TITLE_STYLE}
            className="text-[3.5rem] md:text-[8rem] font-black text-white leading-none tracking-tighter text-center uppercase drop-shadow-2xl"
          >
            FRAPUCINNO
          </h2>
        </motion.div>


        {/* ======================================================== */}
        {/* Layer 3: TOMBOL ORDER */}
        {/* ======================================================== */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.85, 1], [0, 1]),
            y: useTransform(scrollYProgress, [0.85, 1], [50, 0])
          }}
          className="absolute bottom-24 z-20 flex flex-col items-center gap-4 pointer-events-auto"
        >
          <button
            onClick={() => window.open('https://www.instagram.com/sorespace.id/', '_blank')}
            className="bg-[#FF914D] text-[#003366] px-12 py-5 rounded-full text-xl font-black hover:bg-white transition-all shadow-[0_0_30px_rgba(255,145,77,0.6)] border-4 border-white cursor-pointer transform hover:scale-105"
          >
            ORDER NOW
          </button>
        </motion.div>

        {/* ======================================================== */}
        {/* Layer 4: MARQUEE TEXT (Symbol: ✦) */}
        {/* ======================================================== */}
        <div className="absolute bottom-0 w-full bg-[#FF914D] border-t-4 border-white z-30 overflow-hidden py-3">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30
            }}
          >
            {MARQUEE_CONTENT.map((text, index) => (
              <span key={index} className="text-[#003366] font-bold text-xl md:text-2xl mx-4 tracking-wider">
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Loading Screen */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2b1d12]">
            <p className="text-[#FF914D] font-bold animate-pulse text-2xl">MENYIAPKAN KOPI... {loadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}