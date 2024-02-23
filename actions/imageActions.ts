'use server';

import { ANIMATE_PARAMS } from '@/data/imageParams';
import { Style } from '@/data/styles';
import { scaleDown } from '@/lib/utils';
import LeonardoAPI from 'leonardo-ts/src/leonardoApi';
import {
  CheckImageResponse,
  GenerateImageBaseResponse,
} from './actionResponseTypes';

export async function mangaImage(
  formData: FormData,
  style: Style,
  init_image_strength?: number
): Promise<GenerateImageBaseResponse> {
  const imageFile = formData.get('image') as File;
  const width = formData.get('width') as string;
  const height = formData.get('height') as string;
  // Check if the file is an image.
  if (!imageFile.type.startsWith('image/')) {
    return {
      success: false,
      error: 'The uploaded file must be an image',
    };
  }

  if (!process.env.LEONARDO_API_KEY) {
    console.log('No API key found.');
    throw new Error('No API key found.');
  }
  const leonardo = new LeonardoAPI(process.env.LEONARDO_API_KEY, false);

  // create a buffer from the file
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = imageFile.type.split('/')[1];
  // TODO: Fix leonardo api to accept file type instead of file
  const modifiedFileName = imageFile.name.includes('.')
    ? imageFile.name
    : `${imageFile.name}.${fileType}`;
  const response = await leonardo.uploadInitImageFromBuffer(
    buffer,
    modifiedFileName
  );
  // get the image id
  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  const imageId = response.uploadInitImageId;

  const [scaledWidth, scaledHeight] = scaleDown(
    parseInt(width),
    parseInt(height)
  );

  // override style.params.init_strength if init_image_strength is provided
  if (init_image_strength) {
    style.params.init_strength = init_image_strength;
  }

  const mangaImage = await leonardo.generateImagesBase({
    ...style.params,
    init_image_id: imageId,
    width: scaledWidth,
    height: scaledHeight,
  });

  if (!mangaImage.success) {
    return {
      success: false,
      error: mangaImage.message,
    };
  }
  return {
    success: true,
    imageId: mangaImage.generationId,
  };
}

export async function checkForGeneration(
  imageId: string
): Promise<CheckImageResponse> {
  if (!process.env.LEONARDO_API_KEY) {
    throw new Error('No API key found.');
  }
  const leonardo = new LeonardoAPI(process.env.LEONARDO_API_KEY, false);
  const generationStatus = await leonardo.getGenerationResult(imageId);
  if (!generationStatus.success) {
    return {
      success: false,
      status: generationStatus.message,
    };
  }
  return {
    success: true,
    image: {
      url: generationStatus.result.images[0].motionMP4URL
        ? generationStatus.result.images[0].motionMP4URL
        : generationStatus.result.images[0].url,
      id: generationStatus.result.images[0].id,
      type: 'image',
    },
  };
}

export async function animateImage(
  imageId: string
): Promise<GenerateImageBaseResponse> {
  if (!process.env.LEONARDO_API_KEY) {
    throw new Error('No API key found.');
  }
  const leonardo = new LeonardoAPI(process.env.LEONARDO_API_KEY, false);
  const animateImage = await leonardo.animateImageBase(imageId, ANIMATE_PARAMS);
  if (!animateImage.success) {
    return {
      success: false,
      error: animateImage.message,
    };
  }
  return {
    success: true,
    imageId: animateImage.generationId,
  };
}
