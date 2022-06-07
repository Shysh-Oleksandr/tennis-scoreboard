import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/functions";
import { useAppSelector } from "./../app/hooks";
import { convertMsToHM } from "./../utils/functions";

const Stopwatch = () => {
  const { wasRestarted } = useAppSelector((store) => store.scoreboard);
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

  return (
    <div className="mt-16">
      <div className="text-4xl font-bold drop-shadow-xl">
        <span>{formatTime(convertMsToHM(time)[2])}:</span>
        <span>{formatTime(convertMsToHM(time)[1])}:</span>
        <span>{formatTime(convertMsToHM(time)[0])}</span>
      </div>
      <div className="buttons">
        <button onClick={() => setRunning(!running)}>
          {running ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16  text-slate-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16  text-slate-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
