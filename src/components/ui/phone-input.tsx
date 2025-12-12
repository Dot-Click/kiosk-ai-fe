import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/utils/cn.util";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultCountry?: string;
}

export const PhoneInputField = ({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  defaultCountry = "us",
  ...props
}: PhoneInputProps) => {
  return (
    <PhoneInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      country={defaultCountry}
      disabled={disabled}
      inputClass={cn("", className)}
      // buttonClass="btn btn-outline-secondary"
      containerClass="react-tel-input"
      dropdownClass="bg-red-400 border border-gray-300"
      buttonClass="border-r h-12 border-gray-300 bg-transparent"
      {...props}
    />
  );
};
