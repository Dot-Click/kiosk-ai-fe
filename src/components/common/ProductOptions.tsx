import { useState } from "react";
import { Box} from "../../components/ui/box";
import { Stack} from "../../components/ui/stack";
import { Flex} from "../../components/ui/flex";
import { cn } from "@/utils/cn.util";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ProductOption {
  id: string;
  label: string;
  image: string;
}

interface ProductOptionsProps {
  selectedProduct: string;
  onProductSelect: (productId: string) => void;
  options?: ProductOption[];
}

const ProductOptions = ({ 
  selectedProduct, 
  onProductSelect, 
  options = [] 
}: ProductOptionsProps) => {
  const [isExpanded, ] = useState(true);

  return (
    <Box
      className="relative mb-2 w-[310.9px] xl:w-[380px] 2xl:w-[450px] h-[410px] xl:h-[490px] 2xl:h-[590px] overflow-hidden rounded-[10px] xl:rounded-[12px] 2xl:rounded-[14px]"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <Box
        className="absolute inset-0 xl:bg-[length:81%_81%] bg-[length:90%_90%] rounded-[10px]"
        style={{
          backgroundImage: "url('/general/productphotosss.svg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <Box className="absolute z-10 xl:left-[12%] left-[7%] top-[17%] xl:top-[20%] 2xl:top-[20.3%]">
        <Flex className="items-center gap-2 xl:gap-3">
          <img
            src="/general/cups.png"
            alt="icon"
            className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-cover rounded shadow-sm"
          />
          <Stack className="gap-0">
            <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] leading-none tracking-wider">
              Product
            </span>
            <span className="text-[10px] xl:text-[12px] 2xl:text-sm text-[#C1C1C5] font-medium leading-tight">
              Photos
            </span>
          </Stack>
          <ChevronDown 
            className={cn(
              "w-3 h-3 xl:w-4 xl:h-4 text-[#C1C1C5] transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </Flex>
      </Box>

      <Box className="absolute left-[13%] top-[32%] xl:top-[32%] 2xl:top-[33%]">
        <Flex className="items-center gap-3">
          <Box className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 flex-shrink-0">
            <img src="/general/squre.png" alt="square" className="w-full h-full" />
          </Box>
          <span className="text-sm xl:text-base 2xl:text-lg text-white font-light">
            Customize Your Designs:
          </span>
        </Flex>
      </Box>

      <Box
        className="absolute
          left-[35px] top-[166px]
          xl:left-[50px] xl:top-[200px]
          2xl:left-[60px] 2xl:top-[252px]
          3xl:top-[160px] 2xl:w-[330px] xl:w-[279.16px] w-[240.16px]"
      >
        <Flex className="flex-col">
          {options.map((product) => (
            <Box
              key={product.id}
              onClick={() => onProductSelect(product.id)}
              className={cn(
                "cursor-pointer rounded-lg p-3 transition-all duration-200 xl:rounded-xl 2xl:rounded-2xl flex items-center gap-3 xl:gap-4 2xl:gap-5 mb-2",
                selectedProduct === product.id
                  ? "border border-[#F70353] xl:border-2 2xl:border-2"
                  : "border border-transparent hover:bg-[#29292D]/70"
              )}
              style={
                selectedProduct === product.id
                  ? {
                      background: `linear-gradient(to bottom, rgba(247, 3, 83, 0.06) 0%, rgba(247, 3, 83, 0.06) 73%, rgba(23, 7, 38, 1) 100%)`,
                      borderColor: "#F70353",
                      borderWidth: "1px",
                    }
                  : {
                      background: `linear-gradient(to top, rgba(23, 7, 38, 1) 0%, rgba(23, 7, 38, 1) 73%, rgba(23, 7, 38, 1) 100%)`,
                      borderColor: "#170726",
                      borderWidth: "1px",
                    }
              }
            >
              <Box className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 flex-shrink-0 rounded-lg xl:rounded-xl 2xl:rounded-2xl overflow-hidden bg-[#29292D]/50">
                <img
                  src={product.image}
                  alt={product.label}
                  className="w-full h-full object-cover"
                />
              </Box>

              <Flex className="flex-col flex-1 min-w-0">
                <span
                  className="text-sm xl:text-base 2xl:text-lg"
                  style={{
                    fontFamily: "Outfit",
                    fontStyle: "normal",
                    fontWeight: selectedProduct === product.id ? 500 : 300,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: selectedProduct === product.id ? "#FFFFFF" : "#C1C1C5",
                  }}
                >
                  Apply your design on {product.label}
                </span>
              </Flex>

              <ChevronRight className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#C1C1C5] flex-shrink-0" />
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductOptions;