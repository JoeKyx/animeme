"use client"
import { ImageType, useImage } from '@/context/ImageContext';
import { useStyle } from '@/context/StyleContext';
import { useMangaUpload } from '@/hooks/useMangaUpload';
import { LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
export default function VersionSelector() {
  const imageContext = useImage();
  const mangaUpload = useMangaUpload();
  const styleContext = useStyle();

  const mangaTooltip: string = imageContext.image ? 'Generate a manga version of your image. Click the "Generate" Button to get started' : 'Upload an image first';

  const animeTooltip: string = imageContext.generatedImage ? 'Generate an anime version of your image. Click the "Animate" Button to get started' : 'First generate a manga version of your image to unlock this feature';

  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      x: -100
    },
    animate: (index: number) => ({
      opacity: 1,
      duration: 0.9,
      x: 0,
      transition: {
        delay: index * 0.3,
        ease: 'easeOut'
      }
    }),
  }

  const isGrayscaled = (imageType: ImageType): string => {
    return imageContext.activeSection === imageType ? 'grayscale-0 scale-105' : 'hover:grayscale-0 grayscale-[50%]';
  }

  const changeActiveImage = (imageType: ImageType) => {
    imageContext.setActiveSection(imageType);
  }

  return (
    <div className='flex-wrap gap-4 w-full hidden md:flex'>
      <motion.div className='flex z-30' variants={fadeInAnimationVariants}
        initial='initial'
        animate='animate'
        custom={1}>
        {imageContext.image ? (
          <Image src={imageContext.image?.preview} alt={'Uploaded image'} className={`object-contain rounded-xl border border-slate-200  transition-all ` + isGrayscaled('OG')}
            width={180}
            height={180}
            onClick={() => changeActiveImage('OG')}
          />
        ) : <LockedContent text='Manga' description='Upload an image first' locked={true} tooltip='Upload an image to get started' />}
      </motion.div>
      <motion.div className='flex z-20' variants={fadeInAnimationVariants}
        initial='initial'
        animate='animate'
        custom={2}>
        {imageContext.generatedImage ? (
          <Image src={imageContext.generatedImage.url} alt={'Generated image'} className={`object-contain rounded-xl border border-slate-200  transition-all ` + isGrayscaled('Manga')}
            width={180}
            height={180}
            onClick={() => changeActiveImage('Manga')}
          />
        ) :
          <LockedContent text='Manga' description='Generate a manga version of your image' locked={imageContext.image === null}
            tooltip={mangaTooltip} />
        }
      </motion.div>
      <motion.div className='flex z-10' variants={fadeInAnimationVariants}
        initial='initial'
        animate='animate'
        custom={3}>
        {imageContext.animatedImage ? (
          <video src={imageContext.animatedImage.url} className={`object-contain rounded-xl border border-slate-200 transition-all ` + isGrayscaled('Anime')}
            width={180}
            height={180}

            onClick={() => changeActiveImage('Anime')}
          />
        ) :
          <LockedContent text='Anime' description='Generate an anime version of your image' locked={imageContext.generatedImage === null}
            tooltip={animeTooltip}
          />
        }
      </motion.div>


    </div>
  )
}

type LockedContentProps = {
  text: string;
  description: string;
  locked: boolean;
  tooltip: string;
  onClick?: () => void;
}

const LockedContent = ({ text, description, locked, onClick, tooltip }: LockedContentProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className='w-[180px] rounded-xl border border-slate-200 justify-center items-center flex flex-col p-4 bg-slate-950'>

        {locked ? (
          <LockClosedIcon className='w-10 h-10 fill-slate-100 text-slate-200 ' />
        ) :
          <LockOpen1Icon className='w-10 h-10 fill-slate-100 text-slate-200 ' />}
        <p className='text-xl font-semibold text-slate-200 mt-6 uppercase'>{text}</p>
        <p className='text-xs text-slate-300 text-center'>{description}</p>
      </TooltipTrigger>
      <TooltipContent className='max-w-64 bg-slate-900/90 p-4 rounded-lg border-slate-200 border'>{tooltip}</TooltipContent>

    </Tooltip>
  </TooltipProvider>
)
