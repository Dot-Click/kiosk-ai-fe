import { useNavigate } from "react-router";
import CustomButton from "@/components/common/customButton";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Stack } from "@/components/ui/stack";
import { BiSolidCamera } from "react-icons/bi";
import { Flex } from "@/components/ui/flex";
import CustomBlackButton from "@/components/common/customBlackButton";
import { useImageStore } from "@/store/image.store";

const CapturePhotoPage = () => {
  const navigate = useNavigate();
  const selectedImage = useImageStore((state) => state.selectedImage);
  const setSelectedImage = useImageStore((state) => state.setSelectedImage);

  const handleCapturePhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
      }
    };
    input.click();
    return input;
  };

  const handleProcessImage = () => {
    if (selectedImage) {
      navigate("/select-methods/capture-photo/describe-design");
    }
  };

  return (
    <Box className="h-screen w-full bg-[#080319] bg-[url('/general/capture-bg.png')] bg-cover bg-no-repeat flex items-center justify-center p-4">
      <Stack className="w-full max-w-[650px] max-sm:size-[90%] items-center justify-center gap-8">
        <Center
          className="w-full bg-black border-2 border-[#707070]/60 p-2 h-[400px] rounded-2xl mt-22 max-sm:h-[300px] cursor-pointer overflow-hidden"
          style={{ userSelect: "none" }}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="captured-photo"
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src="/general/capture-photo.png"
              alt="capture-photo"
              className="size-86 object-cover"
            />
          )}
        </Center>

        <Flex className="items-center gap-4 max-sm:flex-col">
          <CustomButton
            wrapperClassName="w-[188px] h-[48px]"
            title={selectedImage ? "Re-capture photo" : "Capture Photo"}
            icon={<BiSolidCamera />}
            onClick={handleCapturePhoto}
          />

          {selectedImage && (
            <CustomBlackButton
              wrapperClassName="w-[198px] h-[48px]"
              title="Proceed With This Image?"
              onClick={handleProcessImage}
            />
          )}
        </Flex>
      </Stack>
    </Box>
  );
};

export default CapturePhotoPage;
