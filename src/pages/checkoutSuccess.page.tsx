import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";
// import GoBackButton from "@/components/horizontalnavbar/horizontalnavbar";

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      className="min-h-screen w-full bg-[#080319] bg-[url('/general/describmokupbg.png')] bg-repeat overflow-x-hidden p-4 md:p-10 text-white flex items-center justify-center"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <Box className="max-w-md w-full text-center">
        <Flex className="justify-center mb-6">
          <Box className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </Box>
        </Flex>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Payment successful
        </h1>
        <p className="text-white/60 mb-8">
          Thank you for your order. We’ll process it shortly.
        </p>
        <Flex className="gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-[#4A0E64] border border-white/20 hover:bg-[#5A1E74] text-white font-semibold transition-all"
          >
            Back to home
          </button>
          <button
            onClick={() => navigate("/checkout")}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold transition-all"
          >
            New order
          </button>
        </Flex>
      </Box>
    </Box>
  );
};

export default CheckoutSuccessPage;
