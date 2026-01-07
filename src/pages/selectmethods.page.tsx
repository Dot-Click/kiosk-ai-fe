import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";
import { useNavigate } from "react-router";

interface MethodCardProps {
  title: string;
  description: string;
  imageSrc: string;
  onClick?: () => void;
}

const MethodCard = ({
  title,
  description,
  imageSrc,
  onClick,
}: MethodCardProps) => {
  return (
    <Box
      className="relative cursor-pointer group w-full"
      onClick={onClick}
      style={{
        userSelect: "none",
      }}
    >
      {/* Globe/Background Effect */}
      <Box className="absolute inset-0 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] lg:rounded-[37px] overflow-hidden">
        <Box
          className="absolute inset-0 opacity-65"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 65%, rgba(12, 4, 27, 1) 100%)",
          }}
        />
      </Box>

      {/* Card Container */}
      <Box
        className="relative top-8 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] lg:rounded-[37px] p-[1px] shadow-[inset_0px_3.37px_31.35px_0px_rgba(24,20,32,1)] hover:scale-105 active:scale-95 transition-all duration-300"
        style={{
          background: "linear-gradient(180deg, #712F72 0%, #1B181E 100%)",
        }}
      >
        <Box
          className="absolute top-0 left-14 max-sm:left-0 w-full h-full"
          style={{
            backgroundImage: "url('/general/glow-effect.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <Box
          className="absolute inset-0 -top-14 left-0 w-full h-full"
          style={{
            backgroundImage: "url('/general/glow-effect.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />

        <Box
          className="relative w-full h-full rounded-[20px] sm:rounded-[25px] md:rounded-[30px] lg:rounded-[37px] p-2 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(6, 3, 25, 1) 0%, rgba(17, 7, 25, 1) 69%)",
          }}
        >
          {/* Glow Effect */}
          <Box
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[157px] lg:h-[157px] rounded-full group-hover:opacity-70 transition-opacity"
            style={{
              backgroundImage: "url('/general/glow-effect.svg')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              opacity: 0.12,
            }}
          />

          {/* Content */}
          <Stack className="relative z-10 items-center gap-0">
            {/* Image */}
            <Box className="w-24 h-[90px]">
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-contain"
              />
            </Box>

            {/* Title */}
            <h3 className="text-[#F70353] font-bold text-sm sm:text-base md:text-lg lg:text-xl text-center tracking-wide">
              {title}
            </h3>

            {/* Description */}
            <p className="text-white/70 text-[10px] sm:text-xs md:text-sm lg:text-[0.72rem] text-center font-light min-w-46">
              {description}
            </p>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

const SelectMethodsPage = () => {
  const navigate = useNavigate();
  const methods = [
    {
      title: "Take A Photo",
      description: "Capture your picture",
      imageSrc: "/general/onlycamerA.svg",
      onClick: () => {
        navigate("/select-methods/capture-photo");
      },
    },
    {
      title: "Via Bluetooth",
      description: "Send any image from phone",
      imageSrc: "/general/onlybluetooth.svg",
      onClick: () => {
        navigate("/select-methods/bluetooth");
      },
    }, 
    {
      title: "Speak Prompt",
      description: "Use your Voice",
      imageSrc: "/general/onlyspeak.svg",
      onClick: () => {
        navigate("/select-methods/speak-prompt");
      },
    },
  ];

  return (
    <Box className="min-h-screen w-full bg-[#080319] bg-[url('/general/selectmethod.png')] bg-cover bg-no-repeat flex items-center justify-center md:p-8">
      <Stack className="w-full max-w-[500px] items-center justify-center">
        <Flex
          className="flex-wrap justify-center items-center gap-8 w-full"
          style={{
            userSelect: "none",
          }}
        >
          {methods.map((method, index) => (
            <Box key={index} className="w-[170px] ">
              <MethodCard {...method} />
            </Box>
          ))}
        </Flex>
      </Stack>
    </Box>
  );
};

export default SelectMethodsPage;
