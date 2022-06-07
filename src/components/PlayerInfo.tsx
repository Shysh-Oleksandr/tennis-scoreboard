import React, { useId } from "react";

interface PlayerInfoProps {
  playerNameOneRef: React.RefObject<HTMLInputElement>;
  playerNameTwoRef: React.RefObject<HTMLInputElement>;
}

const PlayerInfo = ({
  playerNameOneRef,
  playerNameTwoRef,
}: PlayerInfoProps) => {
  const nameOneId = useId();
  const nameTwoId = useId();
  return (
    <div className="px-4 w-full">
      <label
        htmlFor={`player${nameOneId}-name`}
        className="mb-2 text-2xl flex items-center"
      >
        First player:
      </label>
      <input
        ref={playerNameOneRef}
        id={`player${nameOneId}-name`}
        placeholder="Name..."
        type="text"
        className="w-full rounded-lg p-2 h-10 transition-colors bg-teal-700 hover:bg-teal-600 focus:bg-teal-600"
      />
      <div className="players__time-container">
        <label
          htmlFor={`player${nameTwoId}-name`}
          className="mb-2 text-2xl flex items-center"
        >
          Second player:
        </label>
        <input
          ref={playerNameTwoRef}
          id={`player${nameTwoId}-name`}
          placeholder="Name..."
          className="w-full rounded-lg p-2 h-10 transition-colors bg-teal-700 hover:bg-teal-600 focus:bg-teal-600"
          type="text"
        />
      </div>
    </div>
  );
};

export default PlayerInfo;
