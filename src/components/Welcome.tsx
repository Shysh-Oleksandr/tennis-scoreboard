import React, { RefObject, useId, useRef } from "react";
import { startGame } from "../features/menu/menuSlice";
import { useAppDispatch } from "./../app/hooks";
import PlayerInfo from "./PlayerInfo";
import {
  IPlayer,
  setPlayers,
  setSetsNumber,
} from "./../features/scoreboard/scoreboardSlice";
import { v4 as uuidv4 } from "uuid";
import { getPlayerName } from "./../utils/functions";

const Welcome = () => {
  const dispatch = useAppDispatch();
  const firstPlayerNameOneRef = useRef() as RefObject<HTMLInputElement>;
  const firstPlayerNameTwoRef = useRef() as RefObject<HTMLInputElement>;
  const secondPlayerNameOneRef = useRef() as RefObject<HTMLInputElement>;
  const secondPlayerNameTwoRef = useRef() as RefObject<HTMLInputElement>;
  const setsNumberRef = useRef() as RefObject<HTMLInputElement>;

  const setsNumberId = useId();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    dispatch(startGame());

    // Set players.
    const players: IPlayer[] = [
      {
        name: getPlayerName(
          firstPlayerNameOneRef.current?.value,
          firstPlayerNameTwoRef.current?.value,
          true
        ),
        id: uuidv4(),
      },
      {
        name: getPlayerName(
          secondPlayerNameOneRef.current?.value,
          secondPlayerNameTwoRef.current?.value,
          false
        ),
        id: uuidv4(),
      },
    ];
    dispatch(setPlayers(players));

    // Set sets number.
    let setsNumber = Number(setsNumberRef.current?.value) || 3;

    dispatch(setSetsNumber(setsNumber));
  }
  return (
    <div className="flex items-center flex-col justify-center text-white sm:py-12 py-8 sm:px-8 px-4 sm:m-8 m-2 w-[40vw] sm:min-w-[400px] min-w-[310px] bg-teal-800 rounded-2xl shadow-2xl">
      <h1 className="text-5xl font-bold mb-8 text-center">Tennis Scoreboard</h1>
      <form className="scoreboard-form" onSubmit={(e) => handleSubmit(e)}>
        <div>
          <div className="flex items-center justify-between">
            <PlayerInfo
              playerNameOneRef={firstPlayerNameOneRef}
              playerNameTwoRef={firstPlayerNameTwoRef}
            />
            <span className="text-2xl font-bold">VS</span>
            <PlayerInfo
              playerNameOneRef={secondPlayerNameOneRef}
              playerNameTwoRef={secondPlayerNameTwoRef}
            />
          </div>
          <div className="flex items-center px-4 mt-4 justify-center">
            <label
              htmlFor={`player${setsNumberId}-id`}
              className="text-2xl flex items-center mr-2"
            >
              Best of
            </label>
            <input
              ref={setsNumberRef}
              id={`player${setsNumberId}-id`}
              defaultValue={3}
              type="number"
              min={1}
              max={99}
              className="w-16 rounded-lg p-2 h-10 transition-colors bg-teal-700 hover:bg-teal-600 focus:bg-teal-600"
            />
            <label
              htmlFor={`player${setsNumberId}-id`}
              className="text-2xl flex items-center ml-2"
            >
              sets
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="py-4 px-8 w-full bg-teal-700 transition-colors hover:bg-teal-600 shadow-lg text-2xl rounded-xl mt-12 font-bold"
        >
          Start
        </button>
      </form>
    </div>
  );
};

export default Welcome;
