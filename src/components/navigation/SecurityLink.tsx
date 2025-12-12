import React from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router";

interface SecurityLinkProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export const SecurityLink: React.FC<SecurityLinkProps> = ({
  className,
  variant = "outline",
  size = "default",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/security");
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      <Shield className="h-4 w-4 mr-2" />
      Security Settings
    </Button>
  );
};
