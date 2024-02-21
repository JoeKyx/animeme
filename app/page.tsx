"use client"
import MyButton from "@/components/ui/mybutton";
import RightSide from "@/components/v2/RightSide";
import Studio from "@/components/v2/Studio";
import VersionSelector from "@/components/v2/VersionSelector";
import VersionSelectorMobile from "@/components/v2/VersionSelectorMobile";
import { useImage } from "@/context/ImageContext";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type View = "home" | "studio";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("home");

  const videoRef = useRef<HTMLVideoElement>(null);
  const isLoopingRef = useRef(false);

  const imageContext = useImage();

  const isButtonDisabled = !imageContext.image

  useEffect(() => {

    const timer = setTimeout(() => {
      if (videoRef.current == null) return;

      videoRef.current.play();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);



  const getStartedClickHandler = () => {
    setCurrentView("studio"); // Switch to studio view
  };

  const pageVariants = {
    initial: { opacity: 0, y: 0 },
    exit: { opacity: 0, y: -0 },
    animate: { opacity: 1, y: 0 }
  };

  const versionSelectorVariants = {
    initial: { opacity: 0, x: -100 },
    exit: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <main className={`md:h-screen md:overflow-hidden ${currentView == 'home' && 'h-screen'}`}>
      <div className="w-full flex md:flex-row flex-col md:items-center md:justify-center h-full">
        <div className="md:h-full md:w-1/2 w-full flex flex-col md:items-center md:justify-center relative">
          <AnimatePresence>
            {currentView === "home" && (
              <motion.div
                className="text-slate-100  flex flex-col md:absolute"
                key="leftSide"

              >
                <div className='flex flex-col md:h-full justify-center items-end md:gap-14 gap-2 pt-14 pb-6 px-10 '>
                  <video muted playsInline className='w-full md:w-2/3' ref={videoRef}>
                    <source
                      src="/videos/animeme-hevc-safari.mp4"
                      type='video/mp4; codecs="hvc1"' />
                    <source
                      src="/videos/animeme-vp9-chrome.webm"
                      type="video/webm" />


                    Your browser does not support the video tag.
                  </video>
                  <GetStartedButton className='w-full md:w-2/3 hidden md:flex' onButtonClick={getStartedClickHandler} />
                </div >


              </motion.div>
            )}
            {currentView === "studio" && (

              <div className="flex flex-col w-full md:h-full md:justify-center md:gap-28 md:px-20 p-4">

                <VersionSelector />
                <VersionSelectorMobile />
                {currentView === "studio" && (
                  <motion.div
                    className="text-slate-100  w-full flex flex-col items-center justify-center"
                    key="studio"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{
                      opacity: { duration: 0.5, ease: "easeInOut", delay: 1 },
                      y: { duration: 2, ease: "easeInOut" },
                      delay: 2.5

                    }}
                  >
                    <Studio />
                  </motion.div>
                )}
              </div>
            )}

          </AnimatePresence>
        </div>
        <RightSide />
        {currentView === "home" && (

          <div className="p-4">
            <GetStartedButton className='w-full md:w-2/3 md:hidden flex' onButtonClick={getStartedClickHandler} />
          </div>
        )}

      </div>

    </main>
  );
}


type GetStartedButtonProps = {
  className?: string;
  onButtonClick?: () => void;
};

const GetStartedButton = ({ className, onButtonClick }: GetStartedButtonProps) => {
  const imageContext = useImage();
  const isButtonDisabled = !imageContext.image
  return (
    <MyButton variant={'default'} className={className} onClick={onButtonClick} disabled={isButtonDisabled} > Get Started<MagicWandIcon className='ml-2 h-4 w-4' /></MyButton >
  )
}