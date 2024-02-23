// hooks/useMangaUpload.js
import { useCallback } from 'react';

import { mangaImage } from '@/actions/imageActions';
import { useImage } from '@/context/ImageContext';
import { Style } from '@/data/styles';
import { PreviewFile } from '@/types/types';
export const useMangaUpload = () => {
  const imageContext = useImage();
  const { setGeneratedImage, setStatus, setError, setImageToShow } =
    imageContext;

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

        const animeImageResponse = await mangaImage(
          form,
          style,
          init_image_strength
        );
        if (animeImageResponse.success) {
          setGeneratedImage(animeImageResponse.image);
          setImageToShow(animeImageResponse.image.url);
          setStatus('SUCCESS');
        } else {
          console.log('error');
          console.log(animeImageResponse.error);
          setError(animeImageResponse.error);
          setStatus('ERROR');
        }
      }
    },
    [setGeneratedImage, setStatus, setError, setImageToShow]
  );

  return { mangaUploadedImage };
};
