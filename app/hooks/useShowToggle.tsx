import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function useShowToggle(initialShow = false, className = "") {
  const [show, setShow] = useState(initialShow);
  function onClick() {
    setShow(!show);
  }

  const ShowToggleIcon = (
    <EyeToggle show={show} onClick={onClick} className={className} />
  );
  return { show, ShowToggleIcon };
}

type Props = {
  show: boolean;
  onClick: () => void;
  className?: string;
  size?: number;
};

export function EyeToggle({ show, onClick, className, size }: Props) {
  const IconComponent = show ? Eye : EyeOff;
  return (
    <IconComponent
      className={`cursor-pointer absolute right-3 text-gray-500 ${className || ""}`}
      onClick={onClick}
      size={size || 20}
    />
  );
}
