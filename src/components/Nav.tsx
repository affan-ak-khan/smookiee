import { MutableRefObject, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import {
  EXTENDED_SLEEP_TIME,
  MAZES,
  PATHFINDING_ALGORITHMS,
  SLEEP_TIME,
  SPEEDS,
} from "../utils/constants";
import { resetGrid } from "../utils/resetGrid";
import { AlgorithmType, MazeType, } from "../utils/types";
import { Select } from "./Select";
import { useSpeed } from "../hooks/useSpeed";
import { runMazeAlgorithm } from "../utils/runMazeAlgorithm";
import { PlayButton}  from "./PlayButton";
import { runPathfindingAlgorithm } from "../utils/runPathfindingAlgorithm";
import { animatePath } from "../utils/animatePath";

export function Nav({
  isVisualizationRunningRef,
}: {
  isVisualizationRunningRef: MutableRefObject<boolean>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    maze,
    setMaze,
    grid,
    setGrid,
    isGraphVisualized,
    setIsGraphVisualized,
    algorithm,
    setAlgorithm,
  } = usePathfinding();
  const { startTile, endTile,setStartTile, setEndTile } = useTile();
  const { speed, setSpeed } = useSpeed();

  const handleGenerateMaze = (maze: MazeType) => {
    if (maze === "NONE") {
      setMaze(maze);
      resetGrid({ grid, startTile, endTile });
      return;
    }

    setMaze(maze);
    setIsDisabled(true);
    runMazeAlgorithm({
      maze,
      grid,
      startTile,
      endTile,
      setIsDisabled,
      speed,
    });
    const newGrid = grid.slice();
    setGrid(newGrid);
    setIsGraphVisualized(false);
  };

  const handlerRunVisualizer = (row: number, col: number) => {
    if (isGraphVisualized) {
      setEndTile({ ...endTile, row: row, col: col });
      setIsGraphVisualized(false);
      resetGrid({ grid: grid.slice(), startTile, endTile });
      return;
    }

    const { traversedTiles, path } = runPathfindingAlgorithm({
      algorithm,
      grid,
      startTile,
      endTile,
    });

    animatePath(traversedTiles, path, startTile, endTile, speed);
    setIsDisabled(true);
    isVisualizationRunningRef.current = true;
    setTimeout(() => {
      const newGrid = grid.slice();
      setGrid(newGrid);
      setIsGraphVisualized(true);
      setIsDisabled(false);
      isVisualizationRunningRef.current = false;
    }, SLEEP_TIME * (traversedTiles.length + SLEEP_TIME * 2) + EXTENDED_SLEEP_TIME * (path.length + 60) * SPEEDS.find((s) => s.value === speed)!.value);
  };

  return (
    <div className="flex items-center justify-center min-h-[4.5rem] border-b shadow-gray-600 sm:px-5 px-0 z-10">
      <div className="flex items-center lg:justify-between justify-center w-full sm:w-[52rem]">
        <h1 className="lg:flex hidden w-[40%] text-2xl pl-1 text-slate-900">
          Dynamic Pathfinding 
        </h1>
        <div className="flex sm:items-end items-center justify-start sm:justify-between sm:flex-row flex-col sm:space-y-0 space-y-3 sm:py-0 py-4 sm:space-x-4 ">
          
          <Select
            label="Graph"
            value={algorithm}
            isDisabled={isDisabled}
            options={PATHFINDING_ALGORITHMS}
            onChange={(e) => {
              setAlgorithm(e.target.value as AlgorithmType);
            }}
          />

          <PlayButton
            isDisabled={isDisabled}
            isGraphVisualized={isGraphVisualized}
            handlerRunVisualizer={handlerRunVisualizer}
          />
        </div>
      </div>
    </div>
  );
}
