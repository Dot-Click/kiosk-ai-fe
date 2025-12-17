import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/stack";

const SelectMethodsPage = () => {
  return (
    <Box className="h-screen bg-[url('/general/start.png')] bg-cover max-md:bg-center">
      <Stack className="h-full flex items-start justify-center ml-28 max-lg:ml-10 max-md:ml-5 max-sm:ml-2 gap-8">
        <h1 className="text-white text-2xl font-bold">Select Methods</h1>
      </Stack>
    </Box>
  );
};

export default SelectMethodsPage;
