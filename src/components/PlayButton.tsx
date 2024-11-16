import { useState } from "react";
import { MouseEventHandler } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";

export function PlayButton({
  handlerRunVisualizer,
  isDisabled,
  isGraphVisualized,
}: {
  isDisabled: boolean;
  isGraphVisualized: boolean;
  handlerRunVisualizer: MouseEventHandler<HTMLButtonElement>;
}) {
  const [endRow, setEndRow] = useState(12)
  const [endCol, setEndCol] = useState(13)
  const handleSubmit = () => {
    handlerRunVisualizer(endRow, endCol)
    }
  return (
    <div>
      <div className="flex space-x-2">
        <input
        onChange={(e) => setEndRow(parseInt(e.target.value))}
          type="text"
          placeholder="End Point Row"
          className="p-2 border rounded"
        />
        <input
        onChange={(e) => setEndCol(parseInt(e.target.value))}
          type="text"
          placeholder="End Point Column"
          className="p-2 border rounded"
        />
      </div>
      <button
        disabled={isDisabled}
        onClick={handleSubmit}
        className="disabled:pointer-events-none disabled:opacity-50 transition ease-in rounded-full p-2.5 shadow-md bg-green-400 hover:bg-green-600 border-none active:ring-green-300 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-30"
      >
        {isGraphVisualized ? (
          <GrPowerReset className="w-5 h-5" />
        ) : (
          <BsFillPlayFill className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
