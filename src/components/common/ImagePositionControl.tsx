import { useState } from "react";
import { Flex } from "../ui/flex";
import { Box } from "../ui/box";
import { 
  ArrowLeft, 
  ArrowRight, 
  Move as MoveIcon, 
  RotateCcw, 
  Maximize2,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut
} from "lucide-react";

interface ImagePositionControlProps {
  positionY: number;
  scale: number;
  onPositionYChange: (delta: number) => void;
  onScaleChange: (delta: number) => void;
  onSetPositionAndScale: (position: [number, number, number], scale: number) => void;
  onCurrentPositionChange?: (position: [number, number, number]) => void;
  /** called when user wants to replace the design (e.g. navigate to upload page) */
  onUploadDesign?: () => void;
}

const ImagePositionControl = ({
  positionY,
  scale,
  onPositionYChange,
  onScaleChange,
  onSetPositionAndScale,
  onCurrentPositionChange,
  // onUploadDesign,
}: ImagePositionControlProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>("center");

  // Logic from ImagePositionControl
  const handlePreset = (preset: string, position: [number, number, number], presetScale: number) => {
    setSelectedPreset(preset);
    onSetPositionAndScale(position, presetScale);
    if (onCurrentPositionChange) {
      onCurrentPositionChange(position);
    }
  };

  const handleScaleChange = (delta: number) => {
    // Limit max scale to 0.23 when back is selected, otherwise 0.8
    const maxScale = selectedPreset === "back" ? 0.23 : 0.8;
    const newScale = Math.max(0.05, Math.min(maxScale, scale + delta));
    if (newScale !== scale) {
      onScaleChange(newScale - scale);
    }
  };

  const presetBtnClass = "flex-1 px-3 py-2 flex items-center justify-center gap-1 rounded-lg border transition-all text-white text-xs font-medium";
  const activeBtn = "bg-[#4A0E64] border-white/40 shadow-[0_0_10px_rgba(74,14,100,0.5)]";
  const inactiveBtn = "bg-[#211C2C] border-white/10 hover:bg-[#2A2438] hover:border-white/20";

  return (
    <Box
      className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-5 rounded-[24px] border border-white/10 bg-[#16121E] shadow-2xl overflow-hidden"
      style={{ 
        backgroundImage: "url('/general/bgofbg.png')",
        backgroundSize: 'cover' 
      }}
    >
      {/* Header - area for repositioning and design actions */}
      <Flex className="items-center gap-3 mb-6 justify-between">
        <Flex className="items-center gap-3">
          <Box className="p-2 bg-[#4A0E64] rounded-lg border border-white/20 text-white">
            <MoveIcon className="w-5 h-5" />
          </Box>
          <span className="text-white font-semibold tracking-tight">Image Position</span>
        </Flex>
        {/* {onUploadDesign && (
          <button
            onClick={onUploadDesign}
            className="text-xs text-[#00BED5] underline"
          >
            Change design
          </button>
        )} */}
      </Flex>

      <div className="space-y-6">
        {/* Preset Section - Kept from Cup UI */}
        <Box>
          <span className="text-white/50 text-[10px] uppercase tracking-[0.15em] font-bold mb-3 block">
            Quick Presets
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePreset("center", [0, 0.04, 0.15], 0.18)}
              className={`${presetBtnClass} ${selectedPreset === "center" ? activeBtn : inactiveBtn}`}
            >
              <Maximize2 className="w-3 h-3" /> Front
            </button>
            <button
              onClick={() => handlePreset("back", [0, 0.04, -0.15], scale)}
              className={`${presetBtnClass} ${selectedPreset === "back" ? activeBtn : inactiveBtn}`}
            >
              <RotateCcw className="w-3 h-3" /> Back
            </button>
            <button
              onClick={() => handlePreset("left", [-0.06, 0.08, 0.15], 0.10)}
              className={`${presetBtnClass} ${selectedPreset === "left" ? activeBtn : inactiveBtn}`}
            >
              <ArrowLeft className="w-3 h-3" /> Left
            </button>
            <button
              onClick={() => handlePreset("right", [0.10, 0.08, 0.15], 0.10)}
              className={`${presetBtnClass} ${selectedPreset === "right" ? activeBtn : inactiveBtn}`}
            >
              <ArrowRight className="w-3 h-3" /> Right
            </button>
          </div>
        </Box>

        {/* Logic: Only show fine-tuning if Front or Back is selected */}
        {(selectedPreset === "center" || selectedPreset === "back") && (
          <>
            <hr className="border-white/5" />

            {/* Size Adjustment - Matches Fine Tuning UI */}
            <Box>
              <span className="text-white/50 text-[10px] uppercase tracking-[0.15em] font-bold mb-3 block">
                Size Control
              </span>
              <Flex className="items-center justify-between bg-[#0F0A16] p-2 rounded-xl border border-white/5">
                <button
                  onClick={() => handleScaleChange(-0.05)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#322A42] text-white active:scale-90 transition-all"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <div className="text-center">
                  <span className="block text-white font-mono text-lg leading-none">
                    {scale.toFixed(2)}
                  </span>
                  <span className="text-white/30 text-[9px] uppercase font-bold">Scale</span>
                </div>

                <button
                  onClick={() => handleScaleChange(0.05)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#322A42] text-white active:scale-90 transition-all"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </Flex>
            </Box>

            {/* Vertical Adjustment - Logic only for Back preset */}
            {selectedPreset === "back" && (
              <Box className="mt-4">
                <span className="text-white/50 text-[10px] uppercase tracking-[0.15em] font-bold mb-3 block">
                  Vertical Adjust
                </span>
                <Flex className="items-center justify-between bg-[#0F0A16] p-2 rounded-xl border border-white/5">
                  <button
                    onClick={() => onPositionYChange(0.01)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#322A42] text-white active:scale-90 transition-all"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  
                  <div className="text-center">
                    <span className="block text-white font-mono text-lg leading-none">
                      {positionY.toFixed(2)}
                    </span>
                    <span className="text-white/30 text-[9px] uppercase font-bold">Height</span>
                  </div>

                  <button
                    onClick={() => onPositionYChange(-0.01)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#322A42] text-white active:scale-90 transition-all"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </Flex>
              </Box>
            )}
          </>
        )}
      </div>
    </Box>
  );
};

export default ImagePositionControl;