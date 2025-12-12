import { Box } from "@/components/ui/box";

export const HorizontalNavbar = () => {
  return (
    <Box className="items-center gap-2 text-red-400 font-bold bg-transparent absolute top-8 left-26 max-lg:left-10 max-md:left-10 max-sm:left-2">
      <img src="/logo/logo.svg" alt="logo" width={150} height={150} />
    </Box>
  );
};
