"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useImage } from '@/context/ImageContext';
import { generatingImageLoadingTexts } from '@/data/text';
import ImageArea from './ImageArea';

type DropZoneProps = {
  className?: string;
  children?: React.ReactNode;
};


export default function DropZone({ className, children }: DropZoneProps) {

  const imageContext = useImage();
  const [rejection, setRejection] = useState<string>();

  const [dropZoneActive, setDropZoneActive] = useState(true);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragActive,
    isDragReject
  } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    disabled: imageContext.status == 'GENERATING' || imageContext.generatedImage != null,
    onDrop: (acceptedFiles, fileRejections) => {

      imageContext.reset();

      if (fileRejections.length > 0) {
        switch (fileRejections[0].errors[0].code) {
          case "file-too-large":
            setRejection("File is too large");
            break;
          case "file-invalid-type":
            setRejection("File type is not supported");
            break;
          default:
            setRejection("File is not supported");
            break;
        }
      }

      const previewFile = acceptedFiles[0]
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          // Once the image is loaded, get its dimensions
          const width = img.naturalWidth;
          const height = img.naturalHeight;

          // Now you can store the file information along with dimensions
          const previewFiles = {
            preview: URL.createObjectURL(previewFile),
            file: previewFile as File,
            width: width,
            height: height
          };

          imageContext.setUploadedImage(previewFiles);
        };

        // Set the src to the result from FileReader
        if (e.target && e.target.result) {
          img.src = e.target.result as string;
        }
      };

      // Read the file as a data URL
      reader.readAsDataURL(previewFile);

    }
  });


  const baseStyle = 'border-dashed border-2 rounded-lg transition-all ease-in-out duration-150 group hover:border-slate-100';
  const defaultStyle = !isDragAccept && !isDragActive && !isDragReject ? 'border-slate-400 bg-slate-950 ' : '';
  const activeStyle = isDragActive ? 'bg-slate-700' : '';
  const acceptStyle = isDragAccept ? 'bg-green-200' : '';
  const rejectStyle = isDragReject ? 'bg-red-200' : '';
  const focusedStyle = isFocused ? 'border-slate-100' : '';

  const combinedClassName = useMemo(() => {
    return [baseStyle, focusedStyle, defaultStyle, activeStyle, acceptStyle, rejectStyle].join(' ')
  }
    , [baseStyle, defaultStyle, focusedStyle, activeStyle, acceptStyle, rejectStyle]);


  useEffect(() => {

    switch (imageContext.status) {
      case 'IDLE':
        setDropZoneActive(true);
        break;
      case 'GENERATING':
        setDropZoneActive(false);
        break;
      case 'SUCCESS':
        setDropZoneActive(false);
        break;
      case 'ANIMATING':
        setDropZoneActive(false);
        break;
      case 'ANIMATION_SUCCESS':
        setDropZoneActive(false);
        break;
      case 'ERROR':
        setDropZoneActive(true);
        break;
      default:
        setDropZoneActive(true);
        break;
    }
  }, [imageContext.status, imageContext.generatedImage?.url, imageContext.animatedImage?.url])

  const textOverlay = !imageContext.image ? 'Drag your image here' : undefined;

  return (


    <ImageArea type='image'
      textOverlay={textOverlay}
      src={imageContext.image?.preview}
      isLoading={imageContext.status == 'GENERATING'}
      loadingMessages={generatingImageLoadingTexts}
      dropZoneInputProps={getInputProps}
      dropZoneRootProps={getRootProps}
      className={combinedClassName}
    />


  )
}
