import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { setIsPaused } from "../features/scoreboard/scoreboardSlice";
import { formatTime } from "../utils/functions";
import { useAppDispatch, useAppSelector } from "./../app/hooks";
import { convertMsToHM } from "./../utils/functions";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";

const Stopwatch = () => {
  const dispatch = useAppDispatch();
  const { wasRestarted, isPaused, isWon } = useAppSelector(
    (store) => store.scoreboard
  );
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  let stopwatchRef = useRef() as MutableRefObject<NodeJS.Timer>;
  useEffect(() => {
    if (running) {
      stopwatchRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else if (!running) {
      clearInterval(stopwatchRef.current);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [running]);

  useEffect(() => {
    setTime(0);
  }, [wasRestarted]);

  useEffect(() => {
    setRunning(!isPaused);
  }, [isPaused]);

  return (
    <div className="mt-12">
      <div className="text-4xl font-bold drop-shadow-xl text-white">
        <span>{convertMsToHM(time)[2]}:</span>
        <span>{formatTime(convertMsToHM(time)[1])}′</span>
        <span>{formatTime(convertMsToHM(time)[0])}″</span>
      </div>
      <div className="buttons">
        {!isWon && (
          <button
            onClick={() => {
              setRunning(!running);
              dispatch(setIsPaused(running));
            }}
          >
            <span
              className={`text-5xl p-3 ${
                running
                  ? "bg-[#46a676] hover:bg-[#3d9167]"
                  : "bg-[#0a493a] hover:bg-[#0e5747]"
              }  rounded-full block text-white mt-2 transition-colors`}
            >
              {running ? <BsFillPauseFill /> : <BsFillPlayFill />}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
