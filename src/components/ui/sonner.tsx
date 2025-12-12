import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "rounded-lg shadow-lg border p-4 bg-white dark:bg-gray-900",
          success: "!bg-green-100 !border-green-400 !text-green-900",
          info: "!bg-blue-100 !border-blue-400 !text-blue-900",
          error: "!bg-red-100 !border-red-400 !text-red-900",
          warning: "!bg-yellow-100 !border-yellow-400 !text-yellow-900",
          title: "font-bold",
          description: "!text-gray-700",
          actionButton:
            "!bg-blue-600 !text-white px-3 !py-1 !rounded hover:!bg-blue-700",
          cancelButton:
            "!bg-gray-200 !text-gray-700 !px-3 !py-1 !rounded hover:!bg-gray-300",
          closeButton:
            "!text-gray-400 hover:!text-gray-700 dark:hover:!text-gray-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
