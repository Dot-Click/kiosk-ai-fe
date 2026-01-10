import { Box } from "@/components/ui/box";
import { cn } from "@/utils/cn.util";
import { useLocation, useNavigate } from "react-router";
import { Flex } from "../ui/flex";
import { Stack } from "../ui/stack";
import { BiArrowBack } from "react-icons/bi";
import { Center } from "../ui/center";

const NavbarWrapper = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Box
      className={cn("bg-transparent absolute cursor-pointer", className)}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

const GoBackButton = ({
  onClick,
  className,
}: {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}) => {
  return (
    <Box
      onClick={onClick}
      className={cn(
        "flex items-center cursor-pointer hover:scale-105 transition-all duration-300 relative",
        "w-[100px] h-[45px] xl:w-[120px] xl:h-[55px] 2xl:w-[140px] 2xl:h-[65px] rounded-[12px] xl:rounded-[14px] 2xl:rounded-[16px] p-[1px]",
        "shadow-[0px_4px_32px_0px_rgba(21,2,8,0.87)]",
        className
      )}
      style={{
        background:
          "conic-gradient(from 90deg at 50% 50%, rgba(240, 196, 211, 1) 0%, rgba(255, 185, 208, 0.08) 25%, rgba(240, 196, 211, 1) 60%)",
        backdropFilter: "blur(32px)",
      }}
    >
      {/* Inner container with background */}
      <Center className="gap-2 xl:gap-3 2xl:gap-4 w-full h-full rounded-[12px] xl:rounded-[14px] 2xl:rounded-[16px] flex items-center bg-black px-2 py-2 xl:px-3 xl:py-3 2xl:px-4 2xl:py-4">
        {/* Icon Container */}

        <Center
          className="rounded-md gap-0 xl:rounded-lg 2xl:rounded-xl"
          style={{
            padding: "8.89px",
            background:
              "linear-gradient(180deg, rgba(247, 3, 83, 1) 0%, rgba(247, 3, 83, 0.55) 100%)",
          }}
        >
          <BiArrowBack className="size-4 xl:size-5 2xl:size-6 text-white" />
        </Center>

        {/* Text */}
        <Flex
          className="text-white font-normal uppercase text-base xl:text-lg 2xl:text-xl"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "16px",
            lineHeight: "1.26em",
            letterSpacing: "0.03em",
          }}
        >
          Back
        </Flex>
      </Center>
    </Box>
  );
};

export default GoBackButton;

const Navbar = ({ handleNavigate }: { handleNavigate: () => void }) => {
  return (
    <NavbarWrapper
      className="items-center gap-2 text-red-400 font-bold top-8 xl:top-10 2xl:top-12 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2 xl:left-32 2xl:left-40 z-50"
      onClick={handleNavigate}
    >
      <img
        src="/logo/logo.svg"
        alt="logo"
        className="w-[150px] h-[150px] xl:w-[180px] xl:h-[180px] 2xl:w-[220px] 2xl:h-[220px]"
      />
    </NavbarWrapper>
  );
};

const SelectMethodsNavbar = () => {
  return (
    <NavbarWrapper className="flex items-center gap-2 justify-center text-white font-bold w-full">
      <Stack className="z-20 justify-center items-center mt-8 xl:mt-10 2xl:mt-12 p-0 gap-0 xl:gap-1 2xl:gap-2">
        <Flex className="font-bold">
          <h1 className="bg-[linear-gradient(0deg,#E5E5E1_90%,#E5E5E5_100%)] bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[2.00rem] 2xl:text-[2.50rem]">
            How would you like to create
          </h1>

          <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[2.10rem] 2xl:text-[2.60rem] ml-2 xl:ml-3 2xl:ml-4">
            YOUR DESGIN?
          </h1>
        </Flex>

        <p
          className="text-[#FFFFFF]/80 text-[13px] xl:text-[15px] 2xl:text-[17px] font-extralight p-0"
          style={{
            letterSpacing: "1.6px",
            userSelect: "none",
          }}
        >
          Choose one of the following methods to get started
        </p>
      </Stack>
    </NavbarWrapper>
  );
};
const CapturePhotoNavbar = () => {
  const navigate = useNavigate();

  const handleGoBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/select-methods");
    console.log("clicked");
  };

  return (
    <>
      <Box className="absolute items-center gap-2 text-red-400 font-bold top-8 xl:top-10 2xl:top-12 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2 xl:left-32 2xl:left-40 z-50">
        <GoBackButton onClick={handleGoBack} />
      </Box>
      <NavbarWrapper className="flex items-center gap-2 justify-center text-white font-bold w-full">
        <Stack className="z-20 justify-center items-center mt-8 xl:mt-10 2xl:mt-12 p-0 gap-0 xl:gap-1 2xl:gap-2 max-sm:mt-18">
          <Flex className="gap-0 font-bold flex-col items-center justify-center text-center">
            <Flex>
              <span className="text-lg xl:text-xl 2xl:text-2xl">🔒</span>
              <h1
                className="bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[1.30rem] 2xl:text-[1.60rem] p-0 m-0"
                style={{
                  backgroundImage:
                    "linear-gradient(5deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 0%, #E5E5E1 40%, #E5E5E5 100%)",
                }}
              >
                Your photo will only be used to generate artwork and
              </h1>
            </Flex>

            <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[1.30rem] 2xl:text-[1.60rem] p-0 -mt-2 xl:-mt-3 2xl:-mt-4">
              YOUR DESGIN?
            </h1>
          </Flex>
        </Stack>
      </NavbarWrapper>
    </>
  );
};
const BluetoothNavbar = () => {
  const navigate = useNavigate();

  const handleGoBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/select-methods");
  };

  return (
    <>
      <Box className="absolute items-center gap-2 text-red-400 font-bold top-8 xl:top-10 2xl:top-12 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2 xl:left-32 2xl:left-40 z-50">
        <GoBackButton onClick={handleGoBack} />
      </Box>
      <NavbarWrapper className="flex items-center gap-2 justify-center text-white font-bold w-full">
        <Stack className="z-20 justify-center items-center mt-8 xl:mt-10 2xl:mt-12 p-0 gap-0 xl:gap-1 2xl:gap-2 max-sm:mt-18">
          <Flex className="gap-0 font-bold flex-col items-center justify-center text-center">
            <Flex>
              <span className="text-lg xl:text-xl 2xl:text-2xl">🔒</span>
              <h1
                className="bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[1.30rem] 2xl:text-[1.60rem] p-0 m-0"
                style={{
                  backgroundImage:
                    "linear-gradient(5deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 0%, #E5E5E1 40%, #E5E5E5 100%)",
                }}
              >
                Connect your phone to the device to get started
              </h1>
            </Flex>

            <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[1.30rem] 2xl:text-[1.60rem] p-0 -mt-2 xl:-mt-3 2xl:-mt-4">
              YOUR BLUETOOTH DESGIN?
            </h1>
          </Flex>
        </Stack>
      </NavbarWrapper>
    </>
  );
};

const DescribeDesignNavbar = () => {
  const navigate = useNavigate();

  const handleGoBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/select-methods/capture-photo");
  };

  return (
    <>
      <Box className="absolute items-center gap-2 text-red-400 font-bold top-8 xl:top-10 2xl:top-12 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2 xl:left-32 2xl:left-40 z-50">
        <GoBackButton onClick={handleGoBack} />
      </Box>
      <NavbarWrapper className="flex items-center gap-2 justify-center text-white font-bold w-full">
        <Stack className="z-20 justify-center items-center mt-8 xl:mt-10 2xl:mt-12 p-0 gap-0 xl:gap-1 2xl:gap-2 max-sm:mt-18">
          <Flex className="gap-0 font-bold flex-col items-center justify-center text-center">
            <Flex className="gap-0">
              <h1
                className="bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[1.30rem] 2xl:text-[1.60rem] p-0 m-0"
                style={{
                  backgroundImage:
                    "linear-gradient(5deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 0%, #E5E5E1 40%, #E5E5E5 100%)",
                }}
              >
                Describe your
              </h1>

              <Box className="relative inline-flex items-center justify-center ml-2 xl:ml-3 2xl:ml-4">
                <Box
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] xl:w-[85px] xl:h-[85px] 2xl:w-[100px] 2xl:h-[100px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(247, 3, 83, 0.4) 0%, rgba(247, 3, 83, 0.2) 40%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[1.50rem] 2xl:text-[1.80rem] p-0 relative z-10">
                  Design
                </h1>
              </Box>
            </Flex>

            <p
              className="text-white/80 text-[12px] xl:text-[14px] 2xl:text-[16px] font-extralight tracking-widest text-center"
              style={{
                letterSpacing: "1.6px",
                userSelect: "none",
              }}
            >
              Be as creative as you want! The AI will generate artwork based on
              your description.
            </p>
          </Flex>
        </Stack>
      </NavbarWrapper>
    </>
  );
};
const ApplyMokupDesignNavbar = () => {
  const navigate = useNavigate();

  const handleGoBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(-1);
  };

  return (
    <>
      <Box className="absolute items-center gap-2 text-red-400 font-bold top-8 xl:top-10 2xl:top-12 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2 xl:left-32 2xl:left-40 z-50">
        <GoBackButton onClick={handleGoBack} />
      </Box>
      <NavbarWrapper className="flex items-center gap-2 justify-center text-white font-bold w-full">
        <Stack className="z-20 justify-center items-center mt-8 xl:mt-10 2xl:mt-12 p-0 gap-0 xl:gap-1 2xl:gap-2 max-sm:mt-18">
          <Flex className="gap-0 font-bold flex-col items-center justify-center text-center">
            <Flex className="gap-0">
              <h1
                className="bg-clip-text text-transparent tracking-wide sm:text-[0.75rem] text-base lg:text-[1.75rem] xl:text-[1.30rem] 2xl:text-[1.60rem] p-0 m-0"
                style={{
                  backgroundImage:
                    "linear-gradient(5deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 0%, #E5E5E1 40%, #E5E5E5 100%)",
                }}
              >
                Apply your design on
              </h1>

              <Box className="relative inline-flex items-center justify-center ml-2 xl:ml-3 2xl:ml-4">
                <Box
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] xl:w-[85px] xl:h-[85px] 2xl:w-[100px] 2xl:h-[100px] rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(247, 3, 83, 0.4) 0%, rgba(247, 3, 83, 0.2) 40%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <h1 className="text-[#F70353] sm:text-[1.10rem] text-xl lg:text-[2.15rem] xl:text-[1.50rem] 2xl:text-[1.80rem] p-0 relative z-10">
                  Mockup
                </h1>
              </Box>
            </Flex>

            <p
              className="text-white/80 text-[12px] xl:text-[14px] 2xl:text-[16px] font-extralight tracking-widest text-center"
              style={{
                letterSpacing: "1.6px",
                userSelect: "none",
              }}
            >
              Be as creative as you want! The AI will generate artwork based on
              your description.
            </p>
          </Flex>
        </Stack>
      </NavbarWrapper>
    </>
  );
};

export const HorizontalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    navigate("/");
  };

  const isSelectMethods = location.pathname === "/select-methods";
  const isCapturePhoto = location.pathname === "/select-methods/capture-photo";
  const isDescribeDesign =
    location.pathname === "/select-methods/capture-photo/describe-design";
  const isApplyMokupDesign =
    location.pathname ===
    "/select-methods/capture-photo/describe-design/apply-mokup-design";
  const isBluetooth = location.pathname === "/select-methods/bluetooth";
  const isHome = location.pathname === "/";

  return (
    <>
      {isHome && <Navbar handleNavigate={handleNavigate} />}
      {isSelectMethods && <SelectMethodsNavbar />}
      {isCapturePhoto && <CapturePhotoNavbar />}
      {isDescribeDesign && <DescribeDesignNavbar />}
      {isApplyMokupDesign && <ApplyMokupDesignNavbar />}
      {isBluetooth && <BluetoothNavbar />}
    </>
  );
};
