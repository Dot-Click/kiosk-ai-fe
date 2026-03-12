import { Flex } from "../ui/flex";
import { Box } from "../ui/box";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CupPositionControlProps {
  offset: number; // radians
  onOffsetChange: (delta: number) => void;
}

const CupPositionControl = ({ offset, onOffsetChange }: CupPositionControlProps) => {
  // convert to degrees for display
  const degrees = (offset * 180) / Math.PI;

  return (
    <Box
      className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
      style={{ backgroundImage: "url('/general/bgofbg.png')" }}
    >
      <Flex className="items-center gap-3 mb-4">
        <Box className="p-2 bg-[#4A0E64] rounded-lg border border-white/20">
          <ArrowRight className="w-5 h-5 text-white transform rotate-180" />
        </Box>
        <span className="text-white/80 text-lg font-normal">Cup Position</span>
      </Flex>

      <Flex className="items-center mt-6 justify-between px-2">
        <button
          onClick={() => onOffsetChange(-0.1)}
          className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
          title="Rotate left"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <span className="text-white text-xl font-semibold min-w-[60px] text-center">
          {degrees.toFixed(0)}°
        </span>

        <button
          onClick={() => onOffsetChange(0.1)}
          className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
          title="Rotate right"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
      </Flex>
    </Box>
  );
};

export default CupPositionControl;
