# Image Crop P5Wrapper

Image Crop P5Wrapper is a React component that allows users to crop images using the p5.js library.

## Author

Gobinath B

## Installation

You can install the package via npm:

```bash
npm install image-crop-p5wrapper

# Usage

Please make sure that the prop image is in file type!

import React, { useState } from 'react';
import { CropImage } from 'image-crop-p5wrapper';

function App() {
  const [undoFile, setUndoFile] = useState(null);
  const [cropped, setCropped] = useState(false);
  const [file, setFile] = useState(null);

  return (
    <div className="App">
      <CropImage
        image={file ? URL.createObjectURL(file) : ""}
        cropped={cropped}
        returnCroppedImage={async (image) => {
          const mime = image.split(";")[0].split(":")[1];
          const blob = await (await fetch(image)).blob();
          const newFile = new File([blob], file.name, { type: mime });
          setUndoFile(file);
          setCropped(true);
          setFile(newFile);
        }}
        resetImage={() => {
          if (undoFile) {
            setCropped(false);
            setFile(undoFile);
          }
        }}
      />
    </div>
  );
}

export default App;
