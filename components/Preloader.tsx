"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 500); // Slight delay after 100%
                    return 100;
                }
                return prev + Math.floor(Math.random() * 10) + 1;
            });
        }, 150);

        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d12] text-[#f2eadd]"
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                >
                    <div className="flex flex-col items-center">
                        <motion.h1
                            className="text-8xl md:text-9xl font-bold tracking-tighter"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {progress}%
                        </motion.h1>
                        <p className="mt-4 text-sm uppercase tracking-widest opacity-50">Brewing Experience</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
