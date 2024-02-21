export type GeneratedImage = {
  url: string,
  id: string
  type: 'image' | 'video'

}

export type AnimeImageResponse = {
  success: true, 
  image: GeneratedImage
} |
{
  success: false,
  error: string
}