import { useRef, useState, useEffect } from "react";
import { Box} from "../../components/ui/box";
import { Flex} from "../../components/ui/flex";
// import { cn } from "@/utils/cn.util";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createPortal } from "react-dom";
import ColorPicker from "./ColorPicker";

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  selectedColor: ColorOption;
  onColorSelect: (color: ColorOption) => void;
  // colors prop no longer used, kept for backwards compatibility
  colors?: ColorOption[];
}

const ColorSelector = ({ 
  selectedColor, 
  onColorSelect, 
  // colors = [] 
}: ColorSelectorProps) => {
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // update dropdown position whenever it opens
  useEffect(() => {
    if (isColorsOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        zIndex: 9999,
      });
    }

    // lock body scrolling while picker is open to avoid scrollbar
    const previousOverflow = document.body.style.overflow;
    if (isColorsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isColorsOpen]);

  return (
    <Box
      className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 rounded-[20px] border border-white/10 overflow-visible bg-cover bg-center shadow-2xl transition-all duration-300"
      style={{ backgroundImage: "url('/general/specialbg.png')" }}
    >
      <Flex
        ref={triggerRef}
        className="items-center justify-between mb-3 cursor-pointer select-none"
        onClick={() => setIsColorsOpen((o) => !o)}
      >
        <Flex className="items-center gap-2">
          {/* show current color circle */}
          <Box
            className="w-5 h-5 rounded-full border border-white/20"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="text-white text-base font-medium">Color</span>
        </Flex>

        <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
          {isColorsOpen ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </button>
      </Flex>

      {/* dropdown panel rendered via portal to avoid scroll container overflow */}
      {isColorsOpen && triggerRef.current && createPortal(
        <Box
          style={dropdownStyle}
          className="bg-[#16121E] rounded-[20px] p-3 shadow-lg"
        >
          <div className="px-1 mb-2">
            <span className="text-[#C1C1C5] text-[11px] uppercase tracking-[2px]">Current: </span>
            <span className="text-white text-[11px] font-bold uppercase tracking-[2px]">
              {selectedColor.name || selectedColor.hex}
            </span>
          </div>

          {/* inline color picker component */}
          <ColorPicker
            color={selectedColor.hex}
            onChange={(hex) => {
              onColorSelect({ id: hex, name: "Custom", hex });
              setIsColorsOpen(false);
            }}
          />
        </Box>,
        document.body
      )}
    </Box>
  );
};

export default ColorSelector;