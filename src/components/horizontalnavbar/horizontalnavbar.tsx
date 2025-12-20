import { Box } from "@/components/ui/box";
import { cn } from "@/utils/cn.util";
import { useLocation, useNavigate } from "react-router";
import { Flex } from "../ui/flex";
import { Stack } from "../ui/stack";

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

const Navbar = ({ handleNavigate }: { handleNavigate: () => void }) => {
  return (
    <NavbarWrapper
      className="items-center gap-2 text-red-400 font-bold top-8 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2"
      onClick={handleNavigate}
    >
      <img src="/logo/logo.svg" alt="logo" width={150} height={150} />
    </NavbarWrapper>
  );
};

const SelectMethodsNavbar = () => {
  return (
    <NavbarWrapper className="flex items-center gap-2 justify-center text-white font-bold w-full">
      <Stack className="z-20 justify-center items-center mt-8">
        <Flex className="font-bold ">
          <h1 className="bg-[linear-gradient(0deg,#E5E5E1_90%,#E5E5E5_100%)] bg-clip-text text-transparent tracking-wide text-[1.75rem]">
            How would you like to create
          </h1>

          <h1 className="text-[#F70353] text-[1.90rem]">YOUR DESGIN?</h1>
        </Flex>

        <p
          className="text-white text-[12px] font-extralight"
          style={{
            letterSpacing: "1.5px",
            userSelect: "none",
          }}
        >
          Choose one of the following methods to get started
        </p>
      </Stack>
    </NavbarWrapper>
  );
};

export const HorizontalNavbar = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  const location = useLocation();
  const isSelectMethods = location.pathname === "/select-methods";

  return (
    <>
      {isSelectMethods ? (
        <SelectMethodsNavbar />
      ) : (
        <Navbar handleNavigate={handleNavigate} />
      )}
    </>
  );
};
