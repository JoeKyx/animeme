import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DropZone from './DropZone';
import { ImageType, useImage } from '@/context/ImageContext';
import ImageArea from './ImageArea';
import { Button } from './ui/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import { BiBrush } from 'react-icons/bi';
import { FaSpinner, FaWandSparkles } from 'react-icons/fa6';
import { useAnimateImage } from '@/hooks/useAnimateImage';
import { useMangaUpload } from '@/hooks/useMangaUpload';
import { GiPaintBrush } from 'react-icons/gi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ImSpinner2 } from 'react-icons/im';
import { useStyle } from '@/context/StyleContext';
import { MovingBorder, Button as MovingBorderButton } from './ui/moving-border';
import { Slider } from './ui/slider';

const Album3D = () => {
  const { activeSection, setActiveSection, generatedImage, animatedImage, status, image } = useImage();
  const { activeStyle } = useStyle();


  const { mangaUploadedImage } = useMangaUpload();
  const { animateGeneratedImage } = useAnimateImage();

  const mangaImageHandler = useCallback(async (strength: number) => {
    // Convert the strength to a value between 0 and 1 and invert it
    const mangaStrength = 1 - (strength / 100);
    if (image) {
      await mangaUploadedImage(image, activeStyle, mangaStrength);
      setActiveSection('Manga');
    }
  }
    , [activeStyle, image, mangaUploadedImage, setActiveSection]);

  const animateImageHandler = useCallback(async () => {
    if (generatedImage) {
      await animateGeneratedImage();
      setActiveSection('Anime');
    }
  }, [generatedImage, animateGeneratedImage, setActiveSection]);

  // Berechnet die X-Position basierend auf dem aktuellen ausgewählten Abschnitt
  const calculateXPosition = useCallback((section: ImageType) => {
    if (activeSection === section) return 0; // Zentrum
    if (activeSection === 'OG') return section === 'Manga' ? 500 : -500;
    if (activeSection === 'Manga') return section === 'OG' ? -500 : 500;
    return section === 'OG' ? 500 : -500;
  }, [activeSection]);

  // Animationsvarianten für die Übergänge
  const variants = {
    enter: (section: ImageType) => ({
      x: calculateXPosition(section),
      scale: activeSection === section ? 1 : 0.8,
      opacity: activeSection === section ? 1 : 1,
      zIndex: activeSection === section ? 1 : 0,
      filter: activeSection === section ? 'brightness(100%) saturate(100%)' : 'brightness(50%) saturate(50%)',
    }),
    exit: {
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
    },
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const sections: ImageType[] = ['OG'];

    if (generatedImage) sections.push('Manga');
    if (animatedImage) sections.push('Anime');

    const currentIndex = sections.indexOf(activeSection);
    if (event.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % sections.length; // Nächste Sektion
      setActiveSection(sections[nextIndex]);
    } else if (event.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + sections.length) % sections.length; // Vorherige Sektion
      setActiveSection(sections[prevIndex]);
    }
  }, [activeSection, animatedImage, generatedImage, setActiveSection]);

  // Fügt den Event-Listener beim Mounten hinzu und entfernt ihn beim Unmounten
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);



  return (
    <div className="flex justify-start  w-full h-full">
      <motion.div
        className="absolute flex flex-col items-center justify-start gap-4 w-full"
        onClick={() => setActiveSection('OG')}
        initial="exit"
        animate="enter"
        exit="exit"
        custom="OG"
        variants={variants}
        transition={{ type: "tween", stiffness: 300, ease: 'easeInOut' }}
      >
        <DropZone />

        <GenerateImageButton onClick={mangaImageHandler} shown={image != null && generatedImage == null} disabled={status == 'GENERATING'} />

      </motion.div>
      {generatedImage && (
        <motion.div
          className="absolute flex flex-col items-center justify-start gap-4 w-full overflow-hidden"
          onClick={() => setActiveSection('Manga')}
          initial="exit"
          animate="enter"
          exit="exit"
          custom="Manga"
          variants={variants}
          transition={{ type: "tween", stiffness: 300, ease: 'easeInOut' }}
        >
          <ImageArea type="image" src={generatedImage.url} isLoading={status == 'ANIMATING'} className='rounded-lg border overflow-hidden' />
          <div className='flex gap-3'>
            <Button variant={'confirm'} className='hover:scale-110 transition-all group'
              onClick={() => window.open(generatedImage.url, '_blank')}
            >Download <DownloadIcon className='w-4 h-4 ml-2 group-hover:translate-y-[1px] group-hover:scale-90' /></Button>
            <AnimateImageButton onClick={animateImageHandler} shown={generatedImage != null && animatedImage == null} disabled={status == 'ANIMATING'} />
          </div>
        </motion.div>
      )}
      {animatedImage && (
        <motion.div
          className="absolute flex flex-col items-center justify-start gap-4 w-full  overflow-hidden"
          onClick={() => setActiveSection('Anime')}
          initial="exit"
          animate="enter"
          exit="exit"
          custom="Anime"
          variants={variants}
          transition={{ type: "tween", stiffness: 300, ease: 'easeInOut' }}
        >

          <ImageArea type="video" src={animatedImage.url} isLoading={false} className='rounded-lg border overflow-hidden' />

          <Button variant={'confirm'} className='mt-4 hover:scale-110 transition-all group'
            onClick={() => window.open(animatedImage.url, '_blank')}
          >Download <DownloadIcon className='w-4 h-4 ml-2 group-hover:translate-y-[1px] group-hover:scale-90' /></Button>
        </motion.div>

      )}
    </div>
  );
};


type ButtonProps = {
  shown: boolean;
  active?: boolean
  disabled?: boolean;
  onClick: () => void;
}

type GenerateImageButtonProps = {
  onClick: (mangaStrength: number) => void;
  shown: boolean;
  disabled?: boolean;
}

const GenerateImageButton = ({ onClick, disabled = false, shown }: GenerateImageButtonProps) => {
  const styleContext = useStyle();
  const [mangaStrength, setMangaStrength] = useState(styleContext.activeStyle.params.init_strength ? styleContext.activeStyle.params.init_strength * 100 : 50);

  useEffect(() => {
    if (styleContext.activeStyle.params.init_strength) {
      setMangaStrength(styleContext.activeStyle.params.init_strength * 100);
    }
  }, [styleContext.activeStyle.params.init_strength])


  return (
    shown && (
      <div className='flex flex-col items-center justify-between h-24'>
        <div className='flex flex-col items-center gap-2'>
          <p className='text-slate-100 text-sm'>Creativity</p>
          <Slider defaultValue={[50]} max={90} min={10} step={1} className='w-56' onValueChange={
            (values) => {
              setMangaStrength(values[0]);
            }
          }
            value={[mangaStrength]}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button disabled={disabled} variant={'magic'} size={"lg"} className='group hover:scale-110 transition-all relative' onClick={() => onClick(mangaStrength)}>Manga me
                <GiPaintBrush className={`h-4 w-4 ml-2 transition-all ease-in-out group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-125 ${disabled && 'hidden'}`} />
                <ImSpinner2 className={`h-4 w-4 ml-2 animate-spin ${!disabled && 'hidden'}`} />
              </Button>

            </TooltipTrigger>
            <TooltipContent>Generates a manga version of the image</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

    )
  )
}

const AnimateImageButton = ({ onClick, disabled = false, shown }: ButtonProps) => {
  return (
    shown &&
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant={'magic'} className='group hover:scale-110 transition-all' onClick={onClick}>Animate
            <FaWandSparkles className={`h-4 w-4 ml-2  transition-all ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125 ${disabled && 'hidden'}`} />
            <ImSpinner2 className={`h-4 w-4 ml-2 animate-spin ${!disabled && 'hidden'}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Generate an animated version of the manga image</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Album3D;
