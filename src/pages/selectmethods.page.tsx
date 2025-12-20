import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";

const SelectMethodsPage = () => {
  return (
    <Box className="h-screen w-full bg-[url('/general/selectmethod.png')] bg-cover max-md:bg-center bg-[#080319] bg-no-repeat">
      <Stack className="h-full flex items-center justify-center">
        <Flex className="flex-wrap justify-center items-center w-[600px] ">
          <img
            src="/general/photo.png"
            alt="photo"
            className="w-50 h-50 cursor-pointer hover:scale-110 transition-all duration-300"
          />
          <img
            src="/general/bluetooth.png"
            alt="bluetooth"
            className="w-50 h-50 cursor-pointer hover:scale-110 transition-all duration-300"
          />
          <img
            src="/general/type.png"
            alt="type"
            className="w-50 h-50 cursor-pointer hover:scale-110 transition-all duration-300"
          />
          <img
            src="/general/speak.png"
            alt="speak"
            className="w-50 h-50 cursor-pointer hover:scale-110 transition-all duration-300"
          />
          {/* <Stack>
            <h1 className="text-white text-2xl font-bold">Take a photo</h1>
            <p>capture your photo</p>
          </Stack> */}
        </Flex>

        {/* <h1 className="text-white text-2xl font-bold">via bluethooth</h1>
        <h1 className="text-white text-2xl font-bold">Type Prompt</h1>
        <h1 className="text-white text-2xl font-bold">Speak Prompt</h1> */}
      </Stack>
    </Box>
  );
};

export default SelectMethodsPage;
