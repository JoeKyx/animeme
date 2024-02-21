"use client"

import { GeneratedImage } from "@/actions/actionResponseTypes";
import { STYLES, Style } from "@/data/styles";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { ImageContextStatus, useImage } from "./ImageContext";

type StyleContextType = {
  activeStyle: Style;
  availableStyles: Style[];
  changeStyle: (style: Style) => void;
  reset: () => void;
  locked: boolean;
};

type SavedGenerations = {
  [styleName: string]: {
    generatedImage: GeneratedImage | null;
    animatedImage: GeneratedImage | null;
    status: ImageContextStatus
  };
};


const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const StyleProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const imageContext = useImage();

  const [activeStyle, setActiveStyle] = useState<Style>(STYLES[0]);
  const [savedGenerations, setSavedGenerations] = useState<SavedGenerations>({});
  const [locked, setLocked] = useState<boolean>(false);

  useEffect(() => {
    if (['GENERATING', 'ANIMATING'].includes(imageContext.status)) {

      setLocked(true);
    }
    else {
      setLocked(false);
    }
  }, [imageContext.status])


  const saveGenerationForStyle = (style: Style) => {
    setSavedGenerations((prevGenerations) => ({
      ...prevGenerations,
      [style.name]: {
        generatedImage: imageContext.generatedImage,
        animatedImage: imageContext.animatedImage,
        status: imageContext.status
      },
    }));
  };

  const changeStyle = (style: Style) => {
    if (locked) return;
    saveGenerationForStyle(activeStyle); // Save current generations before changing style
    if (savedGenerations[style.name]) {
      // If there are saved generations for the new style, update the imageContext
      const { generatedImage, animatedImage, status } = savedGenerations[style.name];
      imageContext.initialize(generatedImage, animatedImage, status); // Assuming this method exists in your ImageContext
    } else {
      imageContext.softReset(); // If there are no saved generations, reset the imageContext
    }
    setActiveStyle(style); // Change to the new style
  };

  const reset = () => {
    setSavedGenerations({});
  }

  const availableStyles = STYLES;


  return <StyleContext.Provider value={{ activeStyle, changeStyle, availableStyles, reset, locked }}>{children}</StyleContext.Provider>;
}

export const useStyle = (): StyleContextType => {
  const context = React.useContext(StyleContext);
  if (!context) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
}