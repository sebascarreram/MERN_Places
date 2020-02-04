import React, { useRef } from "react";

import Button from "./Button";

import "./ImageUpload.css";

const ImageUpload = props => {
  const filePickerRed = useRef();

  const pickedHandler = event => {
    console.log(event.target);
  };

  const pickImageHandler = () => {
    filePickerRed.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRed}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          <img src="" alt="Preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick image
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
