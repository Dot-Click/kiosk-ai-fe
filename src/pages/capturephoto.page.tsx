import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { BiSolidCamera } from "react-icons/bi";

const CapturePhotoPage = () => {
  const handleCapturePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      console.log(file);
    };
    input.click();
    return input;
  };

  return (
    <Box className="h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat flex items-center justify-center p-4">
      <Stack className="w-full max-w-[650px] max-sm:size-[90%] items-center justify-center gap-8">
        <Center
          className="w-full bg-black border-2 border-[#707070]/60 p-2 h-[400px] rounded-2xl mt-22 max-sm:h-[300px] cursor-pointer"
          style={{ userSelect: "none" }}
        >
          <img
            src="/general/capture-photo.png"
            alt="capture-photo"
            className="size-86 object-cover"
          />
        </Center>

        <CustomButton
          wrapperClassName="w-[188px] h-[48px]"
          title="Capture Photo"
          icon={<BiSolidCamera />}
          onClick={handleCapturePhoto}
        />
      </Stack>
    </Box>
  );
};

export default CapturePhotoPage;
