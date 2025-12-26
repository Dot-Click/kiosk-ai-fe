import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";
import { BiSolidMagicWand } from "react-icons/bi";
import { useNavigate } from "react-router";

const FirstPage = () => {
  const navigate = useNavigate();

  // <Stack className="h-screen relative overflow-hidden">
  // {/* GIF Background with smooth loop - using img for better control */}
  // <img
  //   src="/general/gif2.gif"
  //   alt="background"
  //   className="absolute inset-0 w-full h-full object-cover max-md:object-center"
  //   style={{
  //     willChange: "filter",
  //     backfaceVisibility: "hidden",
  //     transform: "translateZ(0)",
  //     imageRendering: "auto",
  //     filter: "blur(0px)",
  //     animation: "smoothLoop 0.1s ease-in-out infinite",
  //   }}
  // />
  // <style>{`
  //   @keyframes smoothLoop {
  //     0%, 100% {
  //       filter: blur(0px);
  //       opacity: 1;
  //     }
  //     50% {
  //       filter: blur(0.3px);
  //       opacity: 0.99;
  //     }
  //   }
  // `}</style>
  // <Stack className="h-full flex items-start justify-center ml-28 max-lg:ml-10 max-md:ml-5 max-sm:ml-2 gap-8 relative z-10">
  return (
    <Stack className="h-screen bg-[url('/general/gif22.gif')] bg-cover max-md:bg-center">
      <Box
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, black 0%, transparent 20%, transparent 80%, black 100%)",
        }}
      />
      <Stack className="h-full flex items-start justify-center ml-28 max-lg:ml-10 max-md:ml-5 max-sm:ml-2 gap-8">
        <Stack className="gap-0" style={{ userSelect: "none" }}>
          <Flex className="z-50">
            <h1 className="bg-[linear-gradient(0deg,#000000_-2%,#E5E5E5_59%)] bg-clip-text text-transparent tracking-wide text-6xl font-bold ">
              Design
            </h1>

            <h1 className="bg-[linear-gradient(180deg,#F70353_35%,#350515_80%)] bg-clip-text text-transparent mb-[-26px] uppercase text-6xl font-extrabold tracking-wide">
              Print
            </h1>
          </Flex>

          <Flex className="font-bold z-20 mt-[-6px]">
            <h1 className="bg-[linear-gradient(0deg,#E5E5E1_90%,#E5E5E5_100%)] bg-clip-text text-transparent tracking-wide text-[1.75rem]">
              Wear Instantly
            </h1>

            <h1 className="text-[#F70353] text-[1.90rem]">AI POWERED</h1>
          </Flex>
        </Stack>

        <p
          className="text-white text-[15px] font-extralight tracking-widest uppercase"
          style={{
            letterSpacing: "6.5px",
            userSelect: "none",
          }}
        >
          Kiosk for instant creativity
        </p>

        <CustomButton
          title="START DESIGNING"
          icon={
            <BiSolidMagicWand className="text-white size-4 sm:size-5 md:size-6" />
          }
          wrapperClassName="w-[160px] h-[40px] sm:w-[180px] sm:h-[44px] md:w-[202px] md:h-[47px] lg:w-[220px] lg:h-[50px]"
          className="w-full h-full text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-widest"
          onClick={() => navigate("/select-methods")}
        />
      </Stack>
    </Stack>
  );
};

export default FirstPage;
