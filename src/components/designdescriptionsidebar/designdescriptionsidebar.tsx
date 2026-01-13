import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Textarea } from "@/components/ui/textarea";
import { BiMicrophone } from "react-icons/bi";
import { cn } from "@/utils/cn.util";

const DesignDescriptionInput = () => {
  const [promptText, setPromptText] = useState("");
  const [readByAI, setReadByAI] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  //   const gradient1 =
  //     "linear-gradient(119.59deg, #32324E 6.65%, rgba(50, 50, 78, 0.87) 53.23%, #303030 97.26%)";

  return (
    <Box
      className="relative w-[310.9px] h-[326.77px] overflow-hidden rounded-[10px]"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* 1. Main Card Background - Union */}
      <Box
        className="absolute inset-0 rounded-[10px]"
        style={{
          boxSizing: "border-box",
          //   background: gradient1,
        }}
      />

      {/* 2. Drop Effect SVG Overlay */}
      <Box
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/general/dropeffects.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
        }}
      />

      {/* "New" Tag */}
      <Box
        className="absolute z-10"
        style={{
          left: "17.46px",
          top: "6px",
          width: "29px  ",
          height: "18px",
        }}
      >
        <span
          style={{
            fontFamily: "Outfit",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "18px",
            letterSpacing: "0.03em",
            color: "#C1C1C5",
          }}
        >
          New
        </span>
      </Box>

      {/* Textarea Container with Switch and Mic inside */}
      <Box
        className="absolute"
        style={{
          left: "18.11px",
          top: "80.59px",
          height: "240.77px",
          width: "279.16px",
        }}
      >
        <Textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="a cool dragon breathing fire in comic book style..."
          className="w-full h-[160px] bg-transparent border-none p-0 pb-16 resize-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#9999AE]"
          style={{
            fontFamily: "Outfit",
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: "16px",
            lineHeight: "20px",
            color: "#9999AE",
          }}
        />

        {/* Switch and Mic inside textarea area */}
        <Flex
          className="absolute bottom-2 left-0 right-0 items-center justify-between pr-2"
          style={{
            paddingLeft: "0px",
          }}
        >
          <Flex className="items-center gap-2">
            <Box
              className="relative cursor-pointer flex-shrink-0"
              onClick={() => setReadByAI(!readByAI)}
              style={{
                width: "29.55px",
                height: "15.4px",
              }}
            >
              <Box
                className="absolute inset-0 rounded-full"
                style={{
                  background: "#29292D",
                  border: "0.2px solid #49495B",
                  boxShadow: "inset 0px 4px 4px #14141B",
                }}
              />
              <Box
                className={cn(
                  "absolute top-[3.41px] w-[13.17px] h-[13.17px] rounded-full transition-all duration-200",
                  readByAI ? "left-[15.13px]" : "left-[1.25px]"
                )}
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0px 0px 4.1px rgba(247, 3, 83, 0.34)",
                }}
              />
            </Box>
            <span
              style={{
                fontFamily: "Outfit",
                fontStyle: "normal",
                fontWeight: 300,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#9999AE",
              }}
            >
              Read by AI prompt
            </span>
          </Flex>

          <Box
            className="flex items-center justify-center cursor-pointer flex-shrink-0"
            onClick={handleMicClick}
            style={{
              width: "40px",
              height: "36px",
              background: "#29292D",
              border: "1px solid #464646",
              borderRadius: "8px",
            }}
          >
            <BiMicrophone
              className="w-[13.13px] h-[17.51px]"
              style={{
                color: "#C1C1C5",
              }}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default DesignDescriptionInput;
