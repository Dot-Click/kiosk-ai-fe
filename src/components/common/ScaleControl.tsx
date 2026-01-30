
import { Box} from "../../components/ui/box";
import { Flex} from "../../components/ui/flex";
import { Minus, Plus, Search } from "lucide-react";

interface ScaleControlProps {
  zoomScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ScaleControl = ({ zoomScale, onZoomIn, onZoomOut }: ScaleControlProps) => {
  return (
    <Box
      className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
      style={{ backgroundImage: "url('/general/bgofbg.png')" }}
    >
      <Flex className="items-center gap-3 mb-4">
        <Box className="p-3 bg-[#4A0E64] rounded-lg border border-white/10">
          <Search className="w-6 h-6 text-white" />
        </Box>
        <span className="text-white/80 text-lg font-normal">Scale</span>
      </Flex>

      <Flex className="items-center mt-10 justify-between px-2">
        <button
          onClick={onZoomOut}
          className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
        >
          <Minus className="w-6 h-6 text-white" />
        </button>

        <span className="text-white text-xl font-semibold min-w-[60px] text-center">
          {zoomScale}%
        </span>

        <button
          onClick={onZoomIn}
          className="w-14 h-12 flex items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </Flex>
    </Box>
  );
};

export default ScaleControl;