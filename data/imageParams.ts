import { GenerateImageQueryParams } from 'leonardo-ts/src/queryParamTypes';
import { AnimateImageParams } from 'leonardo-ts/src/types';

export const SUPER_HERO_PARAMS: GenerateImageQueryParams = {
  prompt: 'anime version, super saiyan, style of dragonball manga',
  modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',
  photoReal: false,
  alchemy: true,
  presetStyle: 'ANIME',
  num_images: 1,
};

export const ANIMATE_PARAMS: AnimateImageParams = {
  motionStrength: 6,
};
