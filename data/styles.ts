import { GenerateImageQueryParams } from 'leonardo-ts/src/queryParamTypes';
import superHeroLogo from '@/public/logos/super_hero.png';
import cuteMonsterLogo from '@/public/logos/cute_monster.png';
import legendsLogo from '@/public/logos/duel_fighter.png';
import princessLogo from '@/public/logos/princess.png';
import { StaticImageData } from 'next/image';
export type Style = {
  name: string;
  params: GenerateImageQueryParams;
  logo: StaticImageData;
};
export const STYLES = [
  {
    name: 'Super Hero',
    params: {
      prompt: 'super saiyan, angry, epic, style of dragonball manga',
      modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',
      photoReal: false,
      alchemy: true,
      presetStyle: 'ANIME',
      init_strength: 0.3,
      num_images: 1,
    },
    logo: superHeroLogo,
  },
  {
    // cute monster (style of pokemon)
    name: 'Cute Monster',
    params: {
      prompt: 'pokemon in background, anime, style of pokemon, epic',
      modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',
      photoReal: false,
      alchemy: true,
      presetStyle: 'ANIME',
      init_strength: 0.3,
      num_images: 1,
    },
    logo: cuteMonsterLogo,
  },
  {
    name: 'Legends',
    params: {
      prompt: 'League of Legends Character, wallpaper',
      modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',
      photoReal: false,
      alchemy: true,
      presetStyle: 'ANIME',
      init_strength: 0.4,
      num_images: 1,
    },
    logo: legendsLogo,
  },
  {
    name: 'Princess',
    params: {
      prompt: 'Princess, disney, fantasy, style of disney princess, beautiful',
      modelId: '1e60896f-3c26-4296-8ecc-53e2afecc132',
      photoReal: false,
      alchemy: true,
      presetStyle: 'ANIME',
      init_strength: 0.5,
      num_images: 1,
    },
    logo: princessLogo,
  },
] as Style[];
