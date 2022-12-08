import React, { FC, useContext } from "react";
import { useParams } from "react-router";
import { DocumentData } from "firebase/firestore";
import { AppContextInterface } from "../../../App";
import { AppContext } from "../../../context/AppContext";
import { isThisPlayerOpponent } from "../../SessionService";
import { Stone, StoneInterface, stoneType } from "../Stones/Stone";
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
import { getColumnLetters, getRowNumbers } from "../BoardService";

export function getRelatedStoneData(
  columnLetter: string,
  rowNumber: number,
  stones: StoneInterface[]
) {
  const relatedStone = stones.filter((stone) => {
    //Filter out the invisible lion stone
    if (stone.invisible) {
      return false;
    }
    return (
      stone.positionRowNumber === rowNumber &&
      stone.positionColumnLetter === columnLetter
    );
  });
  return relatedStone as StoneInterface[];
}

interface FieldInterface {
  columnLetter: string;
  gameData: DocumentData | undefined;
  rowNumber: number;
  stones: StoneInterface[];
  setPositionColumnLetterGlobal: Function;
  setPositionRowNumberGlobal: Function;
  positionColumnLetterGlobal: string | undefined;
  positionRowNumberGlobal: number | undefined;
  canTakeStone: boolean | undefined;
  setCanTakeStone: Function;
}

export const Field: FC<FieldInterface> = ({
  rowNumber,
  columnLetter,
  gameData,
  stones,
  setPositionColumnLetterGlobal,
  setPositionRowNumberGlobal,
  positionColumnLetterGlobal,
  positionRowNumberGlobal,
  canTakeStone,
  setCanTakeStone,
}) => {
  const { gameId } = useParams();
  const { loggedInUserUserId }: AppContextInterface = useContext(AppContext);
  const stone = getRelatedStoneData(columnLetter, rowNumber, stones)[0];

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
      positionColumnLetterGlobal,
      positionRowNumberGlobal,
    });
  };

  function onDragOverHandler(event: React.DragEvent<HTMLDivElement>) {
    enableDropping(event);
    setPositionColumnLetterGlobal(columnLetter);
    setPositionRowNumberGlobal(rowNumber);
  }

  return (
    <div
      onDragOver={onDragOverHandler}
      onDrop={onDropHandler}
      style={{ transform: `rotate(${rotateField(amIOpponent)}deg)` }}
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
          setPositionColumnLetterGlobal={setPositionColumnLetterGlobal}
          setPositionRowNumberGlobal={setPositionRowNumberGlobal}
          positionColumnLetter={stone.positionColumnLetter}
          positionRowNumber={stone.positionRowNumber}
          rowNumbers={getRowNumbers(amIOpponent)}
          columnLetters={getColumnLetters(amIOpponent)}
          canTakeStone={canTakeStone}
          setCanTakeStone={setCanTakeStone}
          gameData={gameData}
          allStones={stones}
        />
      )}
    </div>
  );
};
