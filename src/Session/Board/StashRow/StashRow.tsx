import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./StashRow.module.css";
import { StashField } from "../StashField/StashField";
import { getStashColumnLetters } from "../../PlayerInterface/PlayerInterfaceService";

interface StashRowInterface {
  creatorInterface: boolean;
  amIOpponent: boolean;
}

export const StashRow: FC<StashRowInterface> = ({
  creatorInterface,
  amIOpponent,
}) => {
  const columnLetters = getStashColumnLetters(creatorInterface);
  return (
    <div className={`${styles.StashRow}`}>
      {columnLetters.map((letter) => (
        <StashField key={uuidv4()} columnLetter={letter} />
      ))}
    </div>
  );
};
