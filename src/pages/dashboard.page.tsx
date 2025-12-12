import CustomButton from "@/components/common/customButton";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";
import { BiSolidMagicWand } from "react-icons/bi";

const DashboardPage = () => {
  return (
    <Stack className="h-screen bg-[url('/general/start.png')] bg-cover max-md:bg-center">
      <Stack className="h-full flex items-start justify-center ml-28 max-lg:ml-10 max-md:ml-5 max-sm:ml-2 gap-8">
        <Stack className="gap-0" style={{ userSelect: "none" }}>
          <Flex className="z-10">
            <h1 className="bg-[linear-gradient(0deg,#000000_-2%,#E5E5E5_59%)] bg-clip-text text-transparent tracking-wide text-6xl font-bold ">
              Design
            </h1>

            <h1 className="bg-[linear-gradient(180deg,#F70353_35%,#350515_80%)] bg-clip-text text-transparent mb-[-26px] uppercase text-6xl font-extrabold tracking-wide">
              Print
            </h1>
          </Flex>

          <Flex className="font-bold z-20 mt-[-6px]">
            <h1 className="bg-[linear-gradient(0deg,#E5E5E1_90%,#E5E5E5_100%)] bg-clip-text text-transparent tracking-wide text-[1.75rem]">
              Wear Instantly
            </h1>

            <h1 className="text-[#F70353] text-[1.90rem]">AI POWERED</h1>
          </Flex>
        </Stack>

        <p
          className="text-white text-[15px] font-extralight tracking-widest uppercase"
          style={{
            letterSpacing: "6.5px",
            userSelect: "none",
          }}
        >
          Kiosk for instant creativity
        </p>

        <CustomButton
          title="START DESIGNING"
          icon={<BiSolidMagicWand className="text-white size-6" />}
          wrapperClassName="w-[202px] h-[47px]"
          className="w-[201px] h-[46px] text-[13px] font-semibold tracking-widest"
        />
      </Stack>
    </Stack>
  );
};

export default DashboardPage;
