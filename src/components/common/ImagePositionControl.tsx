import { useState } from "react";
import { Box } from "../ui/box";
import { Flex } from "../ui/flex";
import {
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Maximize2,
} from "lucide-react";

interface ImagePositionControlProps {
  positionY: number;
  scale: number;
  onPositionYChange: (delta: number) => void;
  onScaleChange: (delta: number) => void;
  onSetPositionAndScale: (position: [number, number, number], scale: number) => void;
  onCurrentPositionChange?: (position: [number, number, number]) => void;
}

const ImagePositionControl = ({
  positionY,
  scale,
  onPositionYChange,
  onScaleChange,
  onSetPositionAndScale,
  onCurrentPositionChange,
}: ImagePositionControlProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  const handlePresetClick = (preset: string, position: [number, number, number], presetScale: number) => {
    setSelectedPreset(preset);
    onSetPositionAndScale(position, presetScale);
    if (onCurrentPositionChange) {
      onCurrentPositionChange(position);
    }
  };

  const handleScaleChange = (delta: number) => {
    // Limit max scale to 0.23 when back is selected
    const maxScale = selectedPreset === "back" ? 0.23 : 0.8;
    const newScale = Math.max(0.05, Math.min(maxScale, scale + delta));
    if (newScale !== scale) {
      onScaleChange(newScale - scale);
    }
  };
  
  const presetBtnClass = "px-4 py-2 flex items-center justify-center gap-2 rounded-lg border transition-all text-white text-sm";
  const activeBtnClass = "bg-[#4A0E64] border-white/30 hover:bg-[#5A1E74]";
  const inactiveBtnClass = "bg-[#211C2C] border-white/10 hover:bg-[#2A2438]";

  return (
    <Box
      className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-[#16121E] shadow-2xl overflow-hidden"
      style={{ 
        backgroundImage: "url('/general/bgofbg.png')",
        backgroundSize: 'cover' 
      }}
    >
      {/* Header */}
      <Flex className="items-center gap-3 mb-6">
        <Box className="p-2 bg-[#4A0E64] rounded-lg border border-white/20">
          <Maximize2 className="w-5 h-5 text-white" />
        </Box>
        <span className="text-white font-medium">Image Position</span>
      </Flex>

      <div className="space-y-5">
        {/* Preset Position Buttons */}
        <Box>
          <span className="text-white/50 text-[11px] uppercase tracking-wider font-bold mb-3 block">Position</span>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handlePresetClick("left", [-0.06, 0.08, 0.15], 0.10)} 
              className={`${presetBtnClass} ${selectedPreset === "left" ? activeBtnClass : inactiveBtnClass}`}
              title="Left side (horizontal -0.06, vertical 0.08, size 0.10)"
            >
              <ArrowLeft className="w-3 h-3" /> Left
            </button>
            <button 
              onClick={() => handlePresetClick("right", [0.10, 0.08, 0.15], 0.10)} 
              className={`${presetBtnClass} ${selectedPreset === "right" ? activeBtnClass : inactiveBtnClass}`}
              title="Right side (horizontal 0.10, vertical 0.08, size 0.10)"
            >
              <ArrowRight className="w-3 h-3" /> Right
            </button>
            <button 
              onClick={() => handlePresetClick("center", [0, 0.04, 0.15], 0.18)} 
              className={`${presetBtnClass} ${selectedPreset === "center" ? activeBtnClass : inactiveBtnClass}`}
              title="Center front"
            >
              <Maximize2 className="w-3 h-3" /> Center
            </button>
            <button 
              onClick={() => handlePresetClick("back", [0, 0.04, -0.15], scale)} 
              className={`${presetBtnClass} ${selectedPreset === "back" ? activeBtnClass : inactiveBtnClass}`}
              title="Back"
            >
              <ArrowDown className="w-3 h-3" /> Back
            </button>
          </div>
        </Box>

        {/* Controls - Show for Center or Back */}
        {(selectedPreset === "center" || selectedPreset === "back") && (
          <>
            <hr className="border-white/5" />
            
            {/* Vertical Position - Only show for Back */}
            {selectedPreset === "back" && (
              <Flex className="items-center justify-between mb-4">
                <span className="text-white/70 text-sm">Vertical</span>
                <Flex className="items-center gap-2">
                  <button 
                    onClick={() => onPositionYChange(0.01)} 
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-90 transition-all text-white"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <span className="text-white font-mono text-xs w-12 text-center">{positionY.toFixed(2)}</span>
                  <button 
                    onClick={() => onPositionYChange(-0.01)} 
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-90 transition-all text-white"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </Flex>
              </Flex>
            )}

            {/* Size Controls */}
            <Flex className="items-center justify-between">
              <span className="text-white/70 text-sm">Size</span>
              <Flex className="items-center gap-2">
                <button 
                  onClick={() => handleScaleChange(-0.05)} 
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-90 transition-all text-white"
                  title="Decrease size"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-white font-mono text-xs w-12 text-center">{scale.toFixed(2)}</span>
                <button 
                  onClick={() => handleScaleChange(0.05)} 
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-90 transition-all text-white"
                  title="Increase size"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </Flex>
            </Flex>
          </>
        )}
      </div>
    </Box>
  );
};

export default ImagePositionControl;