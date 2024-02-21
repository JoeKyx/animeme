"use client"
import { useStyle } from '@/context/StyleContext';
import { Style } from '@/data/styles';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BiLock } from 'react-icons/bi';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
type StyleLayout = {

  style: Style;
  position: number; // Numerische Position für die Anordnung
};

export default function StyleSelection({ className }: { className?: string }) {
  const styleContext = useStyle();
  const [styleLayouts, setStyleLayouts] = useState<StyleLayout[]>([]);

  const [error, setError] = useState<string>();

  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };


  useEffect(() => {
    // Erstellt StyleLayout-Objekte mit initialen Positionen
    const layouts = styleContext.availableStyles.map((style, index) => ({
      style,
      position: index - styleContext.availableStyles.findIndex(s => s === styleContext.activeStyle),
    }));

    setStyleLayouts(layouts);
  }, [styleContext.availableStyles, styleContext.activeStyle]);

  useEffect(() => {
    if (!styleContext.locked && error) {
      setError(undefined);
    }
  }, [styleContext.locked, error]);

  const styleChangeClickHandler = (style: Style) => {
    if (styleContext.locked) {
      setError('Please wait until the current generation is finished');
      return;
    };
    setError(undefined);
    styleContext.changeStyle(style);
  }

  return (
    <div className={cn('relative flex  w-full items-center justify-center', className)}>
      <div className='flex w-full justify-center items-center space-x-10'>
        {styleLayouts.map(({ style, position }) => (
          <StyleImage
            key={style.name}
            style={style}
            position={position}
            selected={styleContext.activeStyle === style}
            onClick={() => styleChangeClickHandler(style)}
          />
        ))}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={alertVariants}
            transition={{ duration: 0.5 }}
            className="absolute z-10 w-1/3 bg-opacity-50"
          >
            <Alert>
              <BiLock className="h-4 w-4" />
              <AlertTitle>Please wait!</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

type StyleImageProps = {
  onClick: () => void;
  style: Style;
  position: number;
  selected?: boolean;
};

function StyleImage({ onClick, style, position, selected }: StyleImageProps) {
  const delay = position * 0.1;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0 }} // Start from y: -100 and fully transparent
      animate={{
        opacity: 1,
        zIndex: selected ? 10 : 0, // Ensure selected item is on top
      }}
      transition={{
        duration: 0.7, // Duration of the animation
        delay: delay, // Delay based on the position
        ease: 'linear'
      }}
      className={`flex-none md:w-1/12 w-1/6 h-full transition-transform ${selected ? 'z-10' : 'z-0'} overflow-visible`}
    >
      <Image
        src={style.logo}
        alt={style.name}
        className={` ${!selected ? 'filter grayscale hover:grayscale-0 transition-all' : ''}`}
      />
    </motion.button>
  );
}
