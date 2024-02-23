export type GeneratedImage = {
  url: string;
  id: string;
  type: 'image' | 'video';
};

export type AnimeImageResponse =
  | {
      success: true;
      image: GeneratedImage;
    }
  | {
      success: false;
      error: string;
    };

export type GenerateImageBaseResponse =
  | {
      success: true;
      imageId: string;
    }
  | {
      success: false;
      error: string;
    };

export type CheckImageResponse =
  | {
      success: true;
      image: GeneratedImage;
    }
  | {
      success: false;
      status: string;
    };
