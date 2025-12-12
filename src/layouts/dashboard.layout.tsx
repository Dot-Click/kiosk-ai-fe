import { HorizontalNavbar } from "@/components/horizontalnavbar/horizontalnavbar";
import { Box } from "@/components/ui/box";
import { Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <Box>
      <HorizontalNavbar />
      <Outlet />
    </Box>
  );
};
