import { useState } from "react";
import { Box} from "../../components/ui/box";
import { Flex} from "../../components/ui/flex";
import { cn } from "@/utils/cn.util";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  selectedColor: ColorOption;
  onColorSelect: (color: ColorOption) => void;
  colors?: ColorOption[];
}

const ColorSelector = ({ 
  selectedColor, 
  onColorSelect, 
  colors = [] 
}: ColorSelectorProps) => {
  const [isColorsOpen, setIsColorsOpen] = useState(true);

  return (
    <Box
      className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-hidden bg-cover bg-center shadow-2xl transition-all duration-300"
      style={{ backgroundImage: "url('/general/specialbg.png')" }}
    >
      <Flex
        className="items-center justify-between mb-3 cursor-pointer select-none"
        onClick={() => setIsColorsOpen(!isColorsOpen)}
      >
        <Flex className="items-center gap-2">
          <Box className="w-5 h-5 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="5" fill="#00BED5" fillOpacity="0.8" />
              <circle cx="8" cy="15" r="5" fill="#FF3A02" fillOpacity="0.8" />
              <circle cx="16" cy="15" r="5" fill="#FBAF00" fillOpacity="0.8" />
            </svg>
          </Box>
          <span className="text-white text-base font-medium">Select Color</span>
        </Flex>

        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
          {isColorsOpen ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </button>
      </Flex>

      <Box
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isColorsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-1 mb-2">
          <span className="text-[#C1C1C5] text-[11px] uppercase tracking-[2px]">Current: </span>
          <span className="text-white text-[11px] font-bold uppercase tracking-[2px]">
            {selectedColor.name}
          </span>
        </div>

        <Box className="grid grid-cols-1 gap-1 mt-1">
          {colors.map((color) => (
            <Flex
              key={color.id}
              onClick={() => onColorSelect(color)}
              className={cn(
                "px-3 py-2 justify-between items-center cursor-pointer rounded-lg transition-all duration-200 group",
                selectedColor.id === color.id
                  ? "bg-white/10 border border-white/20"
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <span
                className={cn(
                  "text-[12px] font-medium tracking-wide transition-colors",
                  selectedColor.id === color.id
                    ? "text-white"
                    : "text-[#C1C1C5] group-hover:text-white"
                )}
              >
                {color.name}
              </span>

              <Box
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform duration-200 group-hover:scale-110",
                  selectedColor.id === color.id
                    ? "border-white scale-110 shadow-lg"
                    : "border-white/10"
                )}
                style={{ backgroundColor: color.hex }}
              />
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ColorSelector;