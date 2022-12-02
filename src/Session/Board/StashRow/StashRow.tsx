import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { StashField } from "../StashField/StashField";
import { getStashColumnLetters } from "../../PlayerInterface/PlayerInterfaceService";
import styles from "./StashRow.module.css";

interface StashRowInterface {
  isCreatorInterface: boolean;
}

export const StashRow: FC<StashRowInterface> = ({ isCreatorInterface }) => {
  const columnLetters = getStashColumnLetters(isCreatorInterface);
  return (
    <div className={`${styles.StashRow}`}>
      {columnLetters.map((letter) => (
        <StashField key={uuidv4()} columnLetter={letter} />
      ))}
    </div>
  );
};
