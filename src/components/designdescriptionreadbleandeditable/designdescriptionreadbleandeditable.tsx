import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Textarea } from "@/components/ui/textarea";
import { BiMicrophone } from "react-icons/bi";
import { cn } from "@/utils/cn.util";

interface DesignDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
  isListening?: boolean;
  onMicClick?: () => void;
}

const DesignDescriptionInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  isListening = false,
  onMicClick
}: DesignDescriptionInputProps) => {
  const [readByAI, setReadByAI] = useState(false);

  const handleMicClick = () => {
    if (onMicClick) {
      onMicClick();
    }
  };

  return (
    <Box
      className="relative w-full h-[326.77px] overflow-hidden rounded-[10px]"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* 1. Main Card Background - Union */}
      <Box
        className="absolute inset-0 rounded-[10px]  backdrop-blur-sm"
      />

      {/* 2. Drop Effect SVG Overlay */}
      <Box
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/general/dropeffect.svg')",
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
          width: "29px",
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

      {/* Voice Listening Indicator */}
      {isListening && (
        <Box
          className="absolute z-10"
          style={{
            right: "17.46px",
            top: "6px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span
            style={{
              fontFamily: "Outfit",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "0.03em",
              color: "#00FF00",
            }}
          >
            LIVE
          </span>
        </Box>
      )}

      {/* Textarea Container with Switch and Mic inside */}
      <Box
        className="absolute"
        style={{
          left: "18.11px",
          top: "80.59px",
          height: "240.77px",
          width: "calc(100% - 36px)",
        }}
      >
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-[160px] bg-transparent border-none p-0 pb-16 resize-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#9999AE]"
          style={{
            fontFamily: "Outfit",
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: "16px",
            lineHeight: "20px",
            color: value ? "#FFFFFF" : "#9999AE",
          }}
        />

        {/* Character count */}
        {value && (
          <div className="absolute top-2 right-2">
            <span className="text-xs text-white/50">
              {value.length} chars
            </span>
          </div>
        )}

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
            className={cn(
              "flex items-center justify-center cursor-pointer flex-shrink-0",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleMicClick}
            style={{
              width: "40px",
              height: "36px",
              background: isListening ? "#F70353" : "#29292D",
              border: isListening ? "1px solid #F70353" : "1px solid #464646",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}
          >
            <BiMicrophone
              className="w-[13.13px] h-[17.51px]"
              style={{
                color: isListening ? "#FFFFFF" : "#C1C1C5",
              }}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default DesignDescriptionInput;