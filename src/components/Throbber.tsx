import { LoaderCircle } from "lucide-react";
import React, { FC } from "react";

interface ThrobberProps {
  size?: number;
}

const Throbber: FC<ThrobberProps> = ({ size }) => {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle
        className="animate-[spin_0.2s_linear_infinite]"
        size={size}
      />
    </div>
  );
};

export default Throbber;
