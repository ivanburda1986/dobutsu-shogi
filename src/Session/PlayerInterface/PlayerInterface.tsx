import React, { FC } from "react";
import { DocumentData } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Avatar } from "../../Avatar/Avatar";
import {
  getInterfaceAvatarImageName,
  getInterfaceHeaderColour,
  getInterfacePlayerName,
  getInterfaceRotation,
  getInterfaceTurnBasedBorderStyle,
  getStashColumnLetters,
} from "./PlayerInterfaceService";
import styles from "./PlayerInterface.module.css";
import { StashField } from "../Board/StashField/StashField";
import { StoneInterface } from "../Board/Stones/Stone";

interface PlayerInterfaceProps {
  amIOpponent: boolean;
  creatorInterface: boolean;
  gameData: DocumentData | undefined;
  stones: StoneInterface[];
}

export const PlayerInterface: FC<PlayerInterfaceProps> = ({
  amIOpponent,
  creatorInterface,
  gameData,
  stones,
}) => {
  const columnLetters = getStashColumnLetters(creatorInterface);
  return (
    <div
      className={`${getInterfaceTurnBasedBorderStyle(
        creatorInterface,
        gameData
      )} d-grid mx-3 my-1`}
      style={{ transform: getInterfaceRotation(creatorInterface) }}
    >
      <div
        className={`${getInterfaceHeaderColour(
          creatorInterface
        )} d-flex justify-content-between align-items-center rounded ps-1 pe-3 mb-1 p-1`}
      >
        <Avatar
          name={getInterfaceAvatarImageName(creatorInterface, gameData)}
          playerInterface
        />
        <span className={`${styles.PlayerName} text-primary`}>
          {getInterfacePlayerName(creatorInterface, gameData)}
        </span>
      </div>

      {columnLetters.map((letter) => (
        <StashField
          key={uuidv4()}
          columnLetter={letter}
          stones={stones}
          gameData={gameData}
        />
      ))}
    </div>
  );
};
