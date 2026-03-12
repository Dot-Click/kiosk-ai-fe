// import { useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
}

// simple wrapper around react-colorful's hex picker with a fixed size
const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  // react-colorful applies its own styles; we wrap for sizing
  return (
    <div className="w-full flex justify-center">
      <HexColorPicker
        color={color}
        onChange={onChange}
        className="w-[200px] h-[200px]" // adjust to taste
      />
    </div>
  );
};

export default ColorPicker;
