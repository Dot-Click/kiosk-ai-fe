import { Button } from "../ui/button";
import { cn } from "@/utils/cn.util";
import * as React from "react";
import { motion } from "framer-motion";

interface CustomBlackButtonProps extends React.ComponentProps<typeof Button> {
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

const CustomBlackButton = React.forwardRef<
  HTMLButtonElement,
  CustomBlackButtonProps
>(
  (
    {
      title,
      children,
      className,
      variant,
      size,
      icon,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (
          buttonRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = node;
        if (typeof ref === "function") {
          ref(node);
        }
      },
      [ref]
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
      <div
        className={cn(
          "inline-flex rounded-[13px] p-[1px]",
          "w-[248px] h-[58px]",
          wrapperClassName
        )}
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #C4BEBE 100%)",
          backdropFilter: "blur(32px)",
        }}
      >
        <Button
          ref={setRefs}
          variant={variant}
          size={size}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "font-semibold text-white transition-all duration-200 ease-in-out",
            "!bg-[linear-gradient(180deg,#313131_0%,#0C0C0C_100%)]",
            "flex flex-row justify-center items-center p-2.5 gap-2.5",
            "shadow-[0px_4px_32px_rgba(0,0,0,0.87)]",
            "backdrop-blur-[16px]",
            "w-full h-full",
            "rounded-[12px]",
            "relative overflow-hidden",
            className
          )}
          {...props}
        >
          {/* Liquid animation effect */}
          {isHovered && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: mousePosition.x,
                top: mousePosition.y,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 2.5, 2],
                opacity: [0, 0.4, 0.3, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                repeat: Infinity,
              }}
            >
              <div
                className="w-40 h-40 rounded-full blur-xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,200,200,0.2) 30%, rgba(100,100,100,0.1) 60%, transparent 100%)",
                }}
              />
            </motion.div>
          )}

          {/* Secondary liquid blob that follows cursor smoothly */}
          {isHovered && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: 0,
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              animate={{
                x: mousePosition.x,
                y: mousePosition.y,
                scale: [1, 1.3, 1.1, 1.2],
              }}
              transition={{
                x: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.3,
                },
                y: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.3,
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div
                className="w-24 h-24 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(150,150,150,0.3) 40%, rgba(50,50,50,0.2) 70%, transparent 100%)",
                }}
              />
            </motion.div>
          )}

          <span className="relative z-10 flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title || children}
          </span>
        </Button>
      </div>
    );
  }
);

CustomBlackButton.displayName = "CustomBlackButton";

export default CustomBlackButton;
