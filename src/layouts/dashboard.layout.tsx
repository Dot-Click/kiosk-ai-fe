import { HorizontalNavbar } from "@/components/horizontalnavbar/horizontalnavbar";
import { Box } from "@/components/ui/box";
import { Outlet } from "react-router";
import CurrencySwitcher from "@/components/common/CurrencySwitcher";

export const DashboardLayout = () => {
  return (
    <Box>
      <HorizontalNavbar />
      <CurrencySwitcher />
      <Outlet />
    </Box>
  );
};
