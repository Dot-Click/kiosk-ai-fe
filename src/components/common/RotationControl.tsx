
import { Box} from "../../components/ui/box";
import { Flex} from "../../components/ui/flex";
import { Redo2, RotateCw, Undo2 } from "lucide-react";

interface RotationControlProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  leftTitle?: string;
  rightTitle?: string;
}

const RotationControl = ({ onRotateLeft, onRotateRight, leftTitle = "Show Front Side", rightTitle = "Show Back Side" }: RotationControlProps) => {
  return (
    <Box
      className="relative w-[275px] xl:w-[320px] 2xl:w-[360px] p-4 xl:p-5 rounded-[24px] border border-white/10 bg-cover bg-center shadow-2xl"
      style={{ backgroundImage: "url('/general/bgofbg.png')" }}
    >
      <Flex className="items-center gap-3 mb-4">
        <Box className="p-3 bg-[#2D1B45] rounded-lg border border-white/10">
          <RotateCw className="w-6 h-6 text-[#00BED5]" />
        </Box>
        <span className="text-white/80 text-lg font-normal">Object Rotation</span>
      </Flex>

      <Flex className="items-center mt-10 justify-between px-2">
        <button
          onClick={onRotateLeft}
          className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
          title={leftTitle}
        >
          <Undo2 className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={onRotateRight}
          className="w-14 h-12 flex flex-col items-center justify-center rounded-xl bg-[#211C2C] border border-white/10 hover:bg-[#2A2438] active:scale-95 transition-all group"
          title={rightTitle}
        >
          <Redo2 className="w-5 h-5 text-white" />
        </button>
      </Flex>
    </Box>
  );
};

export default RotationControl;