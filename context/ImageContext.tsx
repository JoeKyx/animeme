"use client"
import { GeneratedImage } from '@/actions/actionResponseTypes';
import { animateImage, mangaImage } from '@/actions/imageActions';
import { PreviewFile } from '@/types/types';
import React, { createContext, useState, useContext, useMemo } from 'react';

export type ImageContextStatus = 'IDLE' | 'GENERATING' | 'SUCCESS' | 'ERROR' | 'ANIMATING' | 'ANIMATION_SUCCESS';
export type ImageType = 'OG' | 'Manga' | 'Anime';

type ImageContextType = {

  image: PreviewFile | null;
  initialize: (generatedImage: GeneratedImage | null, animatedImage: GeneratedImage | null, status: ImageContextStatus) => void;
  setUploadedImage: (image: PreviewFile | null) => void;
  removeImage: () => void;
  setGeneratedImage: (image: GeneratedImage | null) => void;
  setAnimatedImage: (image: GeneratedImage | null) => void;
  generatedImage: GeneratedImage | null;
  animatedImage: GeneratedImage | null;
  error: string | null;
  status: ImageContextStatus;
  setStatus: (status: ImageContextStatus) => void;
  setError: (error: string | null) => void;
  imageToShow: string | undefined;
  activeSection: ImageType;
  softReset: () => void;
  setActiveSection: (section: ImageType) => void;
  setImageToShow: (image: string | undefined) => void;
  reset: () => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const setUploadedImage = (image: PreviewFile | null) => {
    setImage(image);
    setImageToShow(image?.preview);
  }

  const [image, setImage] = useState<PreviewFile | null>(null);
  const [animatedImage, setAnimatedImage] = useState<GeneratedImage | null>(null)

  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

  const [imageToShow, setImageToShow] = useState<string | undefined>(undefined);

  // status that can take the following values: IDLE, GENERATING, SUCCESS, ERROR
  const [status, setStatus] = useState<ImageContextStatus>('IDLE');
  const [error, setError] = useState<string | null>(null);


  const [activeSection, setActiveSection] = useState<ImageType>('OG');

  const reset = () => {
    setImage(null);
    setGeneratedImage(null);
    setAnimatedImage(null);
    setImageToShow(undefined);
    setActiveSection('OG');
    setStatus('IDLE');
    setError(null);
  }

  const softReset = () => {
    setGeneratedImage(null);
    setAnimatedImage(null);
    setActiveSection('OG');
    setStatus('IDLE');
    setError(null);
  }

  const removeImage = () => {
    setImage(null);
  }

  const initialize = (generatedImage: GeneratedImage | null, animatedImage: GeneratedImage | null, status: ImageContextStatus) => {
    setGeneratedImage(generatedImage);
    setAnimatedImage(animatedImage);
    setActiveSection('OG');
    setStatus(status);
  }

  const contextValue = useMemo(() => ({
    image, setAnimatedImage, initialize, setStatus, setUploadedImage, softReset, setGeneratedImage, removeImage, setError, status, generatedImage, error, reset, animatedImage, imageToShow, setImageToShow, activeSection, setActiveSection
  }), [image, animatedImage, status, generatedImage, error, imageToShow, activeSection]);


  return (
    <ImageContext.Provider value={contextValue}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within a ImageProvider');
  }
  return context;
}