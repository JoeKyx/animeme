"use client"
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react'



export default function Header() {
  const borderRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(borderRef.current, { width: 0, }, { width: "100%", duration: 1, ease: "power2.out" });
  });

  return (

    <div className="z-10 mt-10">

      <div className='flex'>

        <h2 className="text-7xl font-extrabold text-center m-0 text-slate-100 tracking-wider">
          aniMe
        </h2>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-[#18CCFC] to-[#AE48FF] rounded-md border border-slate-800" ref={borderRef}></div>
    </div>

  );
}
