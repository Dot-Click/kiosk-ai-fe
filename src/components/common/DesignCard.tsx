import { Box} from "../../components/ui/box";
import CustomButton from "../common/customButton";
import { cn } from "@/utils/cn.util";

interface DesignCardProps {
  selectedImage?: string;
  isApplied: boolean;
  onApply: () => void;
  onCheckout: () => void;
}

const DesignCard = ({ selectedImage, isApplied, onApply, onCheckout }: DesignCardProps) => {
  if (!selectedImage) return null;

  return (
    <Box className="flex flex-col gap-1 items-center w-full max-w-[350px] mx-auto">
      <div
        className="relative w-[330px] h-[210px] bg-no-repeat bg-contain"
        style={{ backgroundImage: "url('/general/applybg.png')" }}
      >
        <div className="absolute bg-[#130E29]/50 backdrop-blur-xl border border-white/10 rounded-[30px] p-4 top-[33.7%] left-[10px] right-[10px] flex items-center justify-between">
          <div className="w-[85px] h-[85px] rounded-2xl overflow-hidden border border-white/10">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <CustomButton
            title={isApplied ? "Applied" : "Apply"}
            onClick={onApply}
            wrapperClassName={cn("w-[140px] h-[52px] rounded-[18px]", isApplied && "bg-none shadow-none")}
          />
        </div>
      </div>

      <Box className="w-full items-center text-center px-2">
        <CustomButton
          title="Continue to Checkout"
          onClick={onCheckout}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          }
          wrapperClassName="w-[96%] h-[60px] rounded-[25px]"
          className="text-[18px]"
        />
      </Box>
    </Box>
  );
};

export default DesignCard;