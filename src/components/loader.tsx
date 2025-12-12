import { LoaderCircle, LucideProps } from "lucide-react";
import { cn } from "@/utils/cn.util";

const Loader: React.FC<LucideProps> = ({ className, ...props }) => {
  return <LoaderCircle className={cn("animate-spin", className)} {...props} />;
};

export { Loader };
