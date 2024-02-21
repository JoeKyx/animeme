import { useImage } from '@/context/ImageContext';
import { useStyle } from '@/context/StyleContext';
import { Style } from '@/data/styles';
import { useAnimateImage } from '@/hooks/useAnimateImage';
import { useMangaUpload } from '@/hooks/useMangaUpload';
import { LockClosedIcon, LockOpen1Icon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { TooltipContent } from '@radix-ui/react-tooltip';
import Image from 'next/image';
import { MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import { VscLoading } from 'react-icons/vsc';
import MyButton from "../ui/mybutton";
import { Slider } from "../ui/slider";
import { Tooltip, TooltipProvider, TooltipTrigger } from '../ui/tooltip';


interface FormData {
  creativity: number;
  selectedStyle: Style;
}

export default function Studio() {
  const mangaUpload = useMangaUpload();
  const animateImage = useAnimateImage();
  const imageContext = useImage();
  const styleContext = useStyle();

  const animateClickHandler = (e: MouseEvent) => {
    e.preventDefault();
    if (imageContext.generatedImage && imageContext.status !== 'ANIMATING' && imageContext.status !== 'GENERATING') {
      animateImage.animateGeneratedImage();
    }
  }

  const isFormDisabled = imageContext.status === 'ANIMATING' || imageContext.status === 'GENERATING';


  const lockVariants = {
    open: { rotate: 0 }, // Assuming the lock is "open" at a 0-degree rotation
    closed: { rotate: -45 }, // Adjust as needed to represent "closed"
  };

  const { handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      selectedStyle: styleContext.activeStyle
    }
  });

  const animateButtonDisabled = !imageContext.generatedImage

  const [test, setTest] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState<Style>(styleContext.activeStyle);

  const changeSelectedStyle = (style: Style) => {
    if (isFormDisabled) return;
    setValue('selectedStyle', style);
    setSelectedStyle(style);
    styleContext.changeStyle(style);
  }

  const onSubmit = (data: FormData) => {
    if (imageContext.image && imageContext.status !== 'GENERATING' && imageContext.status !== 'ANIMATING')
      mangaUpload.mangaUploadedImage(imageContext.image, data.selectedStyle, 1 - (data.creativity / 100));
  }

  return (
    <div className={`form-container ${isFormDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h1 className="md:text-4xl hidden md:block font-bold text-slate-100 mb-4 text-center md:text-left">Manga Studio</h1>
      {/* Create a form with a Slider and a Button */}
      <form className="flex flex-col gap-8 md:gap-2 mt-8 md:mt-0" onSubmit={handleSubmit(onSubmit)} >
        <div className="flex flex-col items-center  mt-4">
          <input name="selectedStyle" type="hidden" />
          <div className='flex gap-4 w-full md:flex-row flex-col'>
            <div className='md:w-1/3'>
              <StudioLabel htmlFor='selectedStyle' description='Choose between different anime styles. Each style comes with a different look.' text='Style' />
            </div>
            <div className='md:w-2/3 flex gap-4'>

              {styleContext.availableStyles.map((style, index) => {

                return (
                  <div key={index} >
                    <Image src={style.logo} alt={style.name} key={index}
                      onClick={() => changeSelectedStyle(style)}
                      className={`transition-all ease-in-out hover:scale-110 duration-200 ${selectedStyle === style ? 'grayscale-0 scale-105' : 'grayscale hover:grayscale-[50%] '}`}
                    />
                  </div>
                )

              })}
            </div>
          </div>
        </div>
        <div className='flex md:items-center mt-8 md:flex-row flex-col gap-2 md:gap-0'>
          <div className="flex items-center w-1/3 ">
            <StudioLabel htmlFor='creativity' description='Choose how creative we should get when generating an anime version of the image. A lower value results in less changes whilst a higher value gives us more creative freedom.' text='Creativity' />
          </div>
          <div className='w-2/3'>
            <Slider defaultValue={[(selectedStyle.params.init_strength || 0.5) * 100]} max={90} min={10} step={1} disabled={isFormDisabled} />
          </div>
        </div>
        <MyButton variant="default" size={"lg"} className="mt-4" disabled={isFormDisabled}
          type="submit"
          slightlyDisabled={imageContext.status === 'GENERATING'}
        >
          Generate {imageContext.status === 'GENERATING' && (
            <VscLoading className="animate-spin h-4 w-4 ml-2" />
          )}
        </MyButton>
        <MyButton variant="default" size={"lg"} className={`mt-4 md:flex ${animateButtonDisabled && 'hidden'}`} disabled={animateButtonDisabled || isFormDisabled} slightlyDisabled={imageContext.status === 'ANIMATING'}
          onClick={animateClickHandler}
        >
          Animate {animateButtonDisabled ? (
            <LockClosedIcon
              className="h-4 w-4 ml-2"

            />
          ) : (
            <LockOpen1Icon className="h-4 w-4 ml-2" />
          )}
          {imageContext.status === 'ANIMATING' && (
            <VscLoading className="animate-spin h-4 w-4 ml-2" />
          )
          }
        </MyButton>


      </form >

    </div >
  )
}

type StudioLabelProps = {
  text: string;
  description: string;
  htmlFor: string;
}
const StudioLabel = ({ text, description, htmlFor }: StudioLabelProps) => {
  return (
    <TooltipProvider>
      <Tooltip>


        <label htmlFor={htmlFor} className="text-slate-100 md:text-2xl text-xl font-bold flex items-center">
          {text} <TooltipTrigger> <QuestionMarkCircledIcon className="h-4 w-4 ml-2" />   </TooltipTrigger>
        </label>

        <TooltipContent className='max-w-64 bg-slate-900/90 p-4 rounded-lg border-slate-200 border'>{description}</TooltipContent>
      </Tooltip>

    </TooltipProvider>
  )
}