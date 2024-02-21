import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { FC } from 'react';
import { VscLoading } from 'react-icons/vsc';
import { useLoadingMessage } from '@/hooks/useLoadingMessage';
import { generatingImageLoadingTexts } from '@/data/text';
import { motion } from 'framer-motion';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import { cn } from '@/lib/utils';

type ImageAreaProps = {
  isLoading?: boolean;
  textOverlay?: string;
  type: 'image' | 'video';
  src?: string;
  loadingMessages?: string[];
  dropZoneInputProps?: <T extends DropzoneInputProps>(props?: T | undefined) => T
  dropZoneRootProps?: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  className?: string;
}

const ImageArea: FC<ImageAreaProps> = ({ isLoading, dropZoneInputProps, dropZoneRootProps, className, textOverlay, type, src, loadingMessages }) => {
  const loadingMessage = useLoadingMessage(loadingMessages || generatingImageLoadingTexts);


  const [widthAndHeight, setWidthAndHeight] = useState<{ width: number | string | null, height: number | string | null }>({ width: null, height: null });
  const [scaling, setScaling] = useState<boolean>(false);


  const TextOverlay = () => (
    <div className='flex flex-col items-center justify-center absolute left-0 top-0 w-full h-full'>
      {textOverlay && (
        <p className='text-xl text-slate-300  group-hover:text-slate-100 transition-all ease-in-out duration-150'>{textOverlay}</p>
      )}
    </div>
  )


  const getAspectRatio = (e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log('Getting aspect ratio')
    calculateWidthAndHeight(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
  }

  const calculateWidthAndHeight = (originalWidth: number, originalHeight: number) => {
    setScaling(true);
    // Define max dimensions - these could be in pixels or as a percentage of the viewport
    const maxWidth = window.innerWidth * 0.7; // 80% of viewport width
    const maxHeight = window.innerHeight * 0.7; // 80% of viewport height

    if (originalWidth < maxWidth && originalHeight < maxHeight) {
      setWidthAndHeight({ width: originalWidth, height: originalHeight });
      setScaling(false);
      return;
    }

    // Initial scaling factors for width and height
    let scaleFactorWidth = maxWidth / originalWidth;
    let scaleFactorHeight = maxHeight / originalHeight;

    // Determine the smallest scaling factor to ensure the image fits within the max dimensions
    let scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

    // Calculate the scaled dimensions
    let scaledWidth = originalWidth * scaleFactor;
    let scaledHeight = originalHeight * scaleFactor;

    // Update the component's state with these dimensions, ensuring they fit within the constraints
    setWidthAndHeight({ width: scaledWidth, height: scaledHeight });
    setScaling(false);
  }




  if (!src) {
    return (
      <div className={cn(className, 'h-40 w-1/2  flex flex-col items-center justify-center cursor-pointer')} {...dropZoneRootProps?.()}>
        {dropZoneInputProps && (
          <input {...dropZoneInputProps()} />
        )}

        <TextOverlay />
      </div>
    )
  }



  if (src && type === 'video') {
    return (
      <div
        style={{
          width: widthAndHeight.width || '100px',
          height: widthAndHeight.height || '100px',
        }}
        className={cn(className, 'flex flex-col items-center justify-center relative bg-black')} {...dropZoneRootProps?.()}>

        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={(e) => {
            calculateWidthAndHeight(e.currentTarget.videoWidth, e.currentTarget.videoHeight);
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {(!widthAndHeight.width || !widthAndHeight.height) && (

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            <VscLoading className='animate-spin h-10 w-10 fill-white' />
          </div>

        )}
      </div>
    )
  }

  if (src && type === 'image') {
    return (
      <div
        style={{
          width: widthAndHeight.width || '100px',
          height: widthAndHeight.height || '100px',
        }}
        className={cn(
          className,
          'flex flex-col items-center justify-center relative bg-black',
        )}
        {...dropZoneRootProps?.()}
      >
        {dropZoneInputProps && (
          <input {...dropZoneInputProps()} />
        )}
        <Image src={src} alt={'Uploaded image'} fill={true} className='object-contain' onLoad={getAspectRatio} />
        {isLoading && (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
              <VscLoading className='animate-spin h-10 w-10 fill-white' />
              <p>{loadingMessage}</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black"
            />
          </>
        )}
        {(!widthAndHeight.width || !widthAndHeight.height) && (

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            <VscLoading className='animate-spin h-10 w-10 fill-white' />
          </div>

        )}
        <TextOverlay />
      </div>

    )
  }
}



export default ImageArea;