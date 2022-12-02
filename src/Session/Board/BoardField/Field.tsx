import React, { FC, useContext } from "react";
import { useParams } from "react-router";
import { DocumentData } from "firebase/firestore";
import { AppContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";
import { isThisPlayerOpponent } from "../../SessionService";
import { StoneInterface, stoneType } from "../Stones/Stone";
import {
  enableDropping,
  rotateField,
  shouldShowLetterLabel,
  shouldShowNumberLabel,
} from "./FieldService";
import styles from "./Field.module.css";
import {
  evaluateDroppedStoneMove,
  onStoneDropCallback,
} from "./FieldServiceStoneDropEvaluation";

interface FieldInterface {
  columnLetter: string;
  gameData: DocumentData | undefined;
  rowNumber: number;
  stones: StoneInterface[];
}

export const Field: FC<FieldInterface> = ({
  rowNumber,
  columnLetter,
  gameData,
  stones,
}) => {
  const { gameId } = useParams();
  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);
  const amIOpponent = isThisPlayerOpponent(
    gameData?.creatorId,
    loggedInUserUserId
  );

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    let movedFromColumnLetter = event.dataTransfer!.getData(
      "movedFromColumnLetter"
    );
    let movedFromRowNumber = event.dataTransfer!.getData("movedFromRowNumber");
    let placedStoneId = event.dataTransfer!.getData("placedStoneId");
    let placedStoneType: stoneType = event.dataTransfer!.getData(
      "placedStoneType"
    ) as stoneType;

    evaluateDroppedStoneMove({
      amIOpponent,
      columnLetter,
      cb: onStoneDropCallback,
      gameData,
      gameId: gameId!,
      loggedInUserUserId,
      movedFromColumnLetter,
      movedFromRowNumber: parseInt(movedFromRowNumber),
      movingToLetter: columnLetter,
      movingToNumber: rowNumber,
      placedStoneId,
      placedStoneType,
      rowNumber,
      stones: stones,
    });
  };

  return (
    <div
      onDragOver={enableDropping}
      onDrop={onDropHandler}
      style={{ transform: rotateField(amIOpponent) }}
      data-row-number={rowNumber}
      data-column-letter={columnLetter}
      className={`${styles.Field} noselect`}
    >
      {shouldShowLetterLabel({ rowNumber, columnLetter }) && (
        <span className={styles.columnLetter}>{columnLetter}</span>
      )}
      {shouldShowNumberLabel({ rowNumber, columnLetter }) && (
        <span className={styles.rowNumber}>{rowNumber}</span>
      )}
    </div>
  );
};
