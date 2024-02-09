import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";

function CropImage(props) {
     console.log("CropImage",props)
  function sketch(p5) {
    let img;
    let CANVAS_HEIGHT;
    let CANVAS_WIDTH;
    let aspectRatio = 1;
    let rect = false;
    let selecting = false;
    let x = -1;
    let y = -1;
    let w = -1;
    let h = -1;

    p5.preload = () => {
      img = p5.loadImage(props.image);
    };
    p5.setup = () => {
      console.log("image loaded", img.width);
      aspectRatio = img.width / img.height;
      console.log("aspectRatio", aspectRatio);
      const MAX_WIDTH = 1000;
      const width = p5.constrain(window.visualViewport.width, 400, MAX_WIDTH);
      if (img.width > MAX_WIDTH) {
        const density = (img.width / width).toFixed(2);
        console.log("intended density", density);
        img.pixelDensity(density);
      }
      CANVAS_WIDTH = p5.constrain(window.visualViewport.width, 400, 800);
      CANVAS_WIDTH = img.width;
      CANVAS_HEIGHT = CANVAS_WIDTH / aspectRatio;
      p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
      const save = p5.createButton("crop");
      save.position(0, -25);
      if (props.cropped) {
        save.attribute("disabled", true);
      }
      save.mousePressed(() => {
        if (rect) {
          let fx = x;
          let fy = y;
          let fw = w;
          let fh = h;
          // when the user drags from right to left
          if (w < 0) {
            fx = x + w;
            fw = -w;
            fy = y + h;
            fh = -h;
          }
          // adjust for pixel density
          fx = fx * img.pixelDensity();
          fy = fy * img.pixelDensity();
          fw = fw * img.pixelDensity();
          fh = fh * img.pixelDensity();
          // check if cropped width or height is less than 2px
          const MIN = 100;
          if (fw < MIN || fh < MIN) {
            alert("Please select a larger area");
            return;
          }
          img.pixelDensity(1);
          const cropped = img.get(fx, fy, fw, fh);
          console.log(cropped.pixelDensity());
          // p5.save(cropped, "cropped.png");
          props?.returnCroppedImage(cropped.canvas.toDataURL());
          rect = false;
          selecting = false;
        }
      });
      const reset = p5.createButton("reset");
      reset.position(50, -25);
      reset.mousePressed(() => {
        rect = false;
        selecting = false;
        props?.resetImage();
      });
    };
    p5.draw = () => {
      p5.background(250);
      p5.image(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (props.cropped) return;
      p5.cursor("crosshair");
      if (rect) {
        if (selecting) {
          w = p5.mouseX - x;
          h = p5.mouseY - y;
        }
        p5.fill(0, 0, 0, 50);
        p5.rect(x, y, w, h);
      }
    };
    p5.mousePressed = () => {
      if (props.cropped) return;
      if (
        p5.mouseX <= 0 ||
        p5.mouseX >= CANVAS_WIDTH ||
        p5.mouseY <= 0 ||
        p5.mouseY >= CANVAS_HEIGHT
      ) {
        return;
      }
      if (selecting) {
        selecting = false;
        rect = true;
      } else {
        selecting = true;
        rect = true;
        x = p5.mouseX;
        y = p5.mouseY;
      }
    };
    p5.mouseDragged = () => {};
    p5.mouseReleased = () => {
      if (props.cropped) return;
      if (
        p5.mouseX <= 0 ||
        p5.mouseX >= CANVAS_WIDTH ||
        p5.mouseY <= 0 ||
        p5.mouseY >= CANVAS_HEIGHT
      ) {
        return;
      }
      if (selecting) {
        selecting = false;
        rect = true;
      } else {
        selecting = true;
        rect = true;
        x = p5.mouseX;
        y = p5.mouseY;
      }
    };
  }
  return (
    <div
      id="container"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          marginTop: 50,
          position: "relative",
        }}
        className="wrapper"
      ><button 
      onClick={props.removeImage} 
      className=" absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white text-xs">
      Remove
    </button>
        <ReactP5Wrapper sketch={sketch} />
      </div>
    </div>
  );
}
export { CropImage };

