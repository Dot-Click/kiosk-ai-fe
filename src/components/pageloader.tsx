import { DotLoader } from "./common/dotloader";
import { Flex } from "./ui/flex";

const PageLoader = () => {
  return (
    <Flex className="h-screen">
      <DotLoader />
    </Flex>
  );
};

export { PageLoader };
