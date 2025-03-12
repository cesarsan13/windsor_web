import React from "react";
import ButtonSlider from "@/app/components/ButtonSlider";

function SliderControl({ text1, text2, ref1, ref2 }) {
  return (
    <div className="absolute left-5 right-5 top-1/2  -translate-y-1/2 transform justify-between flex">
      <ButtonSlider texto={text1} referencia={ref1}></ButtonSlider>
      <ButtonSlider texto={text2} referencia={ref2}></ButtonSlider>
    </div>
  );
}

export default SliderControl;
