"use client"
import { useImage } from '@/context/ImageContext';
import { generatingImageLoadingTexts } from '@/data/text';
import { useLoadingMessage } from '@/hooks/useLoadingMessage';
import { DownloadIcon, Share1Icon } from '@radix-ui/react-icons';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { VscLoading } from 'react-icons/vsc';
import IconButton from '../ui/IconButton';


const RightSide = () => {
  const [rejection, setRejection] = useState<string>();
  const [dropZoneActive, setDropZoneActive] = useState(true);



  const imageContext = useImage();

  const showShare = imageContext.activeSection === 'Manga' || imageContext.activeSection === 'Anime';


  const imageVariants = {
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    animate: { opacity: 1 }
  };

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragActive,
    isDragReject
  } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    disabled: imageContext.status == 'GENERATING' || imageContext.generatedImage != null,
    onDrop: (acceptedFiles, fileRejections) => {

      imageContext.reset();

      if (fileRejections.length > 0) {
        switch (fileRejections[0].errors[0].code) {
          case "file-too-large":
            setRejection("File is too large");
            break;
          case "file-invalid-type":
            setRejection("File type is not supported");
            break;
          default:
            setRejection("File is not supported");
            break;
        }
      }

      const previewFile = acceptedFiles[0]
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          // Once the image is loaded, get its dimensions
          const width = img.naturalWidth;
          const height = img.naturalHeight;

          // Now you can store the file information along with dimensions
          const previewFiles = {
            preview: URL.createObjectURL(previewFile),
            file: previewFile as File,
            width: width,
            height: height
          };


          imageContext.setUploadedImage(previewFiles);
        };

        // Set the src to the result from FileReader
        if (e.target && e.target.result) {
          img.src = e.target.result as string;
        }
      };

      // Read the file as a data URL
      reader.readAsDataURL(previewFile);

    }
  });


  const divRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 30, damping: 50 });
  const springY = useSpring(y, { stiffness: 30, damping: 50 });

  const handleMouseMove = (event: { clientX: number; clientY: number; }) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      springX.set(event.clientX - rect.left - rect.width / 2);
      springY.set(event.clientY - rect.top - rect.height / 2);
    }
  };



  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  const shadowX = useTransform(springX, [-100, 100], [-20, 20]);
  const shadowY = useTransform(springY, [-100, 100], [-20, 20]);
  const boxShadow = useTransform([shadowX, shadowY], ([sX, sY]) => `${sX}px ${sY}px 20px rgba(0, 0, 0, 0.3)`);

  const [widthAndHeight, setWidthAndHeight] = useState<{ width: number | string | null, height: number | string | null }>({ width: null, height: null });
  const [scaling, setScaling] = useState<boolean>(false);



  const [maxWidthAndHeight, setMaxWidthAndHeight] = useState<{ maxWidth: number, maxHeight: number }>({ maxWidth: 0, maxHeight: 0 });


  const calculateWidthAndHeight = useCallback((originalWidth: number, originalHeight: number) => {
    setScaling(true);

    if (originalWidth < maxWidthAndHeight.maxWidth && originalHeight < maxWidthAndHeight.maxHeight) {
      setWidthAndHeight({ width: originalWidth, height: originalHeight });
      setScaling(false);
      return;
    }

    // Initial scaling factors for width and height
    let scaleFactorWidth = maxWidthAndHeight.maxWidth / originalWidth;
    let scaleFactorHeight = maxWidthAndHeight.maxHeight / originalHeight;

    // Determine the smallest scaling factor to ensure the image fits within the max dimensions
    let scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

    // Calculate the scaled dimensions
    let scaledWidth = originalWidth * scaleFactor;
    let scaledHeight = originalHeight * scaleFactor;

    // Update the component's state with these dimensions, ensuring they fit within the constraints
    setWidthAndHeight({ width: scaledWidth, height: scaledHeight });
    setScaling(false);
  }, [maxWidthAndHeight.maxWidth, maxWidthAndHeight.maxHeight]);

  const getAspectRatio = (e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    calculateWidthAndHeight(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
  }

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : window.innerWidth * 0.4;
      const maxHeight = window.innerHeight < 1000 ? window.innerHeight * 0.5 : window.innerHeight * 0.7;
      setMaxWidthAndHeight({ maxWidth, maxHeight });
      if (imageContext.image) {
        calculateWidthAndHeight(imageContext.image.width, imageContext.image.height)
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateWidthAndHeight, imageContext.image]);

  const getAspectRatioVideo = (e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    calculateWidthAndHeight(e.currentTarget.videoWidth, e.currentTarget.videoHeight)
  }

  const getShareUrl = () => {
    if (imageContext.activeSection === 'Manga' && imageContext.generatedImage) {
      return imageContext.generatedImage.url;
    }
    if (imageContext.activeSection === 'Anime' && imageContext.animatedImage) {
      return imageContext.animatedImage.url;
    }
    return '';
  }

  return (
    <div className="flex flex-col md:w-1/2 w-full h-full items-center justify-center p-4 md:p-0">
      <motion.div
        ref={divRef}
        className='flex items-center justify-center border-slate-100 border-dotted border-2 rounded-xl'
        style={{
          rotateX,
          rotateY,
          rotateZ: 0,
          transformPerspective: 1000,
          transformStyle: 'preserve-3d',
          width: widthAndHeight.width || maxWidthAndHeight.maxWidth || 100,
          height: widthAndHeight.height || maxWidthAndHeight.maxHeight || 100,
          boxShadow: boxShadow.get(),
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          springX.set(0);
          springY.set(0);
        }}

      >

        <AnimatePresence>
          {imageContext.activeSection === 'OG' && (
            <motion.div key="OG" className='w-full h-full absolute'
              initial="initial"
              animate="animate"
              exit="exit"
              variants={imageVariants}
            >
              <div  {...getRootProps()} className='w-full h-full group'>

                <input {...getInputProps()} />

                {imageContext.image ? (
                  <Image
                    key="OG"
                    src={imageContext.image.preview}
                    alt={'Uploaded image'}
                    layout='fill'
                    className='object-contain rounded-xl'
                    onLoad={getAspectRatio}

                  />
                ) : (
                  <TextOverlay textOverlay={'Upload your image to get started'} />
                )}
                {(imageContext.status === 'GENERATING' || imageContext.status === 'ANIMATING') && <LoadingOverlay />}

              </div>
            </motion.div>
          )}
          {imageContext.activeSection === 'Manga' && (
            <motion.div key="Manga" className='w-full h-full absolute'
              initial="initial"
              animate="animate"
              exit="exit"
              variants={imageVariants}
            >
              {imageContext.generatedImage ? (
                <Image
                  key="Manga"
                  src={imageContext.generatedImage.url}
                  alt={'Generated image'}
                  layout='fill'
                  className='object-contain rounded-xl'
                  onLoad={getAspectRatio}
                />
              ) : (
                <TextOverlay textOverlay={'Generate an anime version of your image'} />
              )}
              {(imageContext.status === 'GENERATING' || imageContext.status === 'ANIMATING') && <LoadingOverlay />}
            </motion.div>
          )}
          {imageContext.activeSection === 'Anime' && (
            <motion.div key="Anime" className='w-full h-full absolute'
              initial="initial"
              animate="animate"
              exit="exit"
              variants={imageVariants}
            >
              {imageContext.animatedImage ? (
                <video src={imageContext.animatedImage.url} className='rounded-xl' autoPlay loop muted
                  onLoadedData={getAspectRatioVideo}
                  width={widthAndHeight.width || maxWidthAndHeight.maxWidth}
                  height={widthAndHeight.height || maxWidthAndHeight.maxHeight}
                />
              ) : (
                <TextOverlay textOverlay={'Generate an anime version of your image'} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {showShare && (
        <div className={`flex gap-2`}>
          <ShareButton url={getShareUrl()} />
          <DownloadButton url={getShareUrl()} />

        </div>
      )}
    </div >
  );
};

const TextOverlay = ({ textOverlay }: { textOverlay: string | null }) => (
  <div className='flex flex-col items-center justify-center absolute left-0 top-0 w-full h-full'>
    {textOverlay && (
      <p className='text-xl text-slate-300  group-hover:text-slate-100 transition-all ease-in-out duration-150 group-hover:scale-110'>{textOverlay}</p>
    )}
  </div>
)

const ShareButton = ({ url }: { url: string }) => {

  // shareHandler should copy url to clipboard
  const shareHandler = async () => {
    try {
      await navigator.share({
        title: 'Share this image',
        text: 'Check out this image',
        url: url
      });
    } catch (error) {
      console.log('Error sharing', error);
    }
  }

  return (

    <IconButton Icon={Share1Icon} onClick={shareHandler} tooltipContent='Share' />
  )
}

const DownloadButton = ({ url }: { url: string }) => {
  return (
    <IconButton Icon={DownloadIcon} onClick={() => window.open(url, '_blank')} tooltipContent='Download' />
  )
}

const LoadingOverlay = () => {
  const loadingMessage = useLoadingMessage(generatingImageLoadingTexts);
  return (
    <>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <VscLoading className='animate-spin h-10 w-10 fill-white' />
        <p className='text-center'>{loadingMessage}</p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-black"
      />
    </>
  )
}



export default RightSide;
