import React, { FC, useContext } from "react";
import {
  getImgReference,
  getStashFieldClassRef,
} from "../../../images/imageRelatedService";
import styles from "./StashField.module.css";
import playerInterfaceStyles from "../../PlayerInterface/PlayerInterface.module.css";
import { Stone, StoneInterface } from "../Stones/Stone";
import { getColumnLetters, getRowNumbers } from "../BoardService";
import { getRelatedStoneData } from "../BoardField/Field";
import { isThisPlayerOpponent } from "../../SessionService";
import { AppContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";
import { DocumentData } from "firebase/firestore";

interface Props {
  columnLetter: string;
  stones: StoneInterface[];
  gameData: DocumentData | undefined;
}

export const StashField: FC<Props> = ({ columnLetter, stones, gameData }) => {
  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);
  const imgReference = getStashFieldClassRef(columnLetter);
  const styleReference = `slot${imgReference}`;
  const stone = getRelatedStoneData(columnLetter, 1, stones)[0];
  const amIOpponent = isThisPlayerOpponent(
    gameData?.creatorId,
    loggedInUserUserId
  );
  return (
    <>
      <div
        data-row-number="1"
        data-column-letter={columnLetter}
        className={`${styles.StashField} ${playerInterfaceStyles[styleReference]} noselect`}
      >
        <div
          style={{
            backgroundImage: `url(${getImgReference(columnLetter)})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            opacity: "0.1",
          }}
          className={`${styles.StashField} ${styles.StashFieldBg}`}
        ></div>
        {stone && (
          <Stone
            amIOpponent={amIOpponent}
            key={stone.id}
            id={stone.id}
            type={stone.type}
            originalOwner={stone.originalOwner}
            currentOwner={stone.currentOwner}
            highlighted={stone.highlighted}
            stashed={stone.stashed}
            invisible={stone.invisible}
            positionColumnLetter={stone.positionColumnLetter}
            positionRowNumber={stone.positionRowNumber}
            rowNumbers={getRowNumbers(amIOpponent)}
            columnLetters={getColumnLetters(amIOpponent)}
            gameData={gameData}
            allStones={stones}
          />
        )}
      </div>
    </>
  );
};
