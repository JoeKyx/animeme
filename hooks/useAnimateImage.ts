// hooks/useAnimateImage.js
import { useContext, useCallback } from 'react';
import { useImage } from '@/context/ImageContext'; // adjust the import path as necessary
import { animateImage } from '@/actions/imageActions';

export const useAnimateImage = () => {
  const imageContext = useImage();
  const {
    setAnimatedImage,
    setStatus,
    setError,
    setImageToShow,
    generatedImage,
  } = imageContext;

  const animateGeneratedImage = useCallback(async () => {
    if (generatedImage) {
      setStatus('ANIMATING');
      try {
        const animatedImageResponse = await animateImage(generatedImage.id);
        if (animatedImageResponse.success) {
          setAnimatedImage(animatedImageResponse.image);
          setImageToShow(animatedImageResponse.image.url);
          setStatus('ANIMATION_SUCCESS');
        } else {
          setError(animatedImageResponse.error);
          setStatus('ERROR');
        }
      } catch (error) {
        setError('An unexpected error occurred');
        setStatus('ERROR');
      }
    }
  }, [setAnimatedImage, setStatus, setError, setImageToShow, generatedImage]);

  return { animateGeneratedImage };
};
