import React from "react";
import { ImSpinner2 } from "react-icons/im";

const Spinner = () => {
  return (
    <div className="animate-spin mr-2 flex items-center justify-center">
      <ImSpinner2 className="text-2xl" />
    </div>
  );
};

export default Spinner;
