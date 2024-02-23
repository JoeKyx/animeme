// hooks/useMangaUpload.js
import { useCallback } from 'react';

import { checkForGeneration, mangaImage } from '@/actions/imageActions';
import { useImage } from '@/context/ImageContext';
import { Style } from '@/data/styles';
import { PreviewFile } from '@/types/types';
export const useMangaUpload = () => {
  const imageContext = useImage();
  const { setGeneratedImage, setStatus, setError, setImageToShow } =
    imageContext;

  const waitForResult = useCallback(
    async (imageId: string) => {
      let intervalId: NodeJS.Timeout | null = null;
      let startTime = Date.now();

      const checkImage = async () => {
        const animeImageResponse = await checkForGeneration(imageId);
        if (animeImageResponse.success) {
          setGeneratedImage(animeImageResponse.image);
          setImageToShow(animeImageResponse.image.url);
          setStatus('SUCCESS');
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
    [setGeneratedImage, setStatus, setError, setImageToShow]
  );

  const mangaUploadedImage = useCallback(
    async (image: PreviewFile, style: Style, init_image_strength?: number) => {
      console.log('Hi');
      if (image) {
        setStatus('GENERATING');
        console.log('Image', image);
        const form = new FormData();
        form.append('image', image.file);
        form.append('width', image.width.toString());
        form.append('height', image.height.toString());

        const baseResponse = await mangaImage(form, style, init_image_strength);
        if (!baseResponse.success) {
          setError(baseResponse.error);
          setStatus('ERROR');
        } else {
          const imageId = baseResponse.imageId;
          waitForResult(imageId);
        }
      }
    },
    [setError, setStatus, waitForResult]
  );

  return { mangaUploadedImage };
};
