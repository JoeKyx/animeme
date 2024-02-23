// hooks/useAnimateImage.js
import { animateImage, checkForGeneration } from '@/actions/imageActions';
import { useImage } from '@/context/ImageContext'; // adjust the import path as necessary
import { useCallback } from 'react';

export const useAnimateImage = () => {
  const imageContext = useImage();
  const {
    setAnimatedImage,
    setStatus,
    setError,
    setImageToShow,
    generatedImage,
  } = imageContext;

  const waitForResult = useCallback(
    async (imageId: string) => {
      let intervalId: NodeJS.Timeout | null = null;
      let startTime = Date.now();

      const checkImage = async () => {
        const animeImageResponse = await checkForGeneration(imageId);
        if (animeImageResponse.success) {
          setAnimatedImage(animeImageResponse.image);
          setImageToShow(animeImageResponse.image.url);
          setStatus('ANIMATION_SUCCESS');
          if (intervalId) clearInterval(intervalId); // Stop the interval when the image is generated
        } else {
          if (animeImageResponse.status !== 'PENDING') {
            setError(animeImageResponse.status);
            setStatus('ERROR');
            if (intervalId) clearInterval(intervalId);
          }
        }

        // Stop the interval if it's been running for more than 1 minute
        if (Date.now() - startTime > 60000) {
          setError('Timeout');
          setStatus('ERROR');
          if (intervalId) clearInterval(intervalId);
        }
      };

      // Start the interval
      intervalId = setInterval(checkImage, 5000);
    },
    [setAnimatedImage, setStatus, setError, setImageToShow]
  );

  const animateGeneratedImage = useCallback(async () => {
    if (generatedImage) {
      setStatus('ANIMATING');
      const animatedImageResponse = await animateImage(generatedImage.id);

      if (!animatedImageResponse.success) {
        setError(animatedImageResponse.error);
        setStatus('ERROR');
      } else {
        waitForResult(animatedImageResponse.imageId);
      }
    }
  }, [generatedImage, setStatus, setError, waitForResult]);

  return { animateGeneratedImage };
};
