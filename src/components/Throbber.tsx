import { LoaderCircle } from "lucide-react";
import React from "react";

const Throbber = () => {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle className="animate-spin" size={32} />
    </div>
  );
};

export default Throbber;
